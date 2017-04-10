'use strict';

const opentype = require('opentype.js');

const getGlyphStore = require('./getGlyphStore');
const renderText = require('./renderText');
const getAttributesString = require('./getAttributesString');

/**
 * @param {OpenTypeSVGLoaderOptions} options
 * @param {string} compilationId
 * @param {Function} callback
 * @return {string}
 */
module.exports = function renderSVG(options, compilationId, callback) {
  opentype.load(options.fonts[options.font], function(error, font) {
    if (error) {
      callback(error);
    } else {
      const glyphStore = getGlyphStore(options, font, compilationId);

      const texts = renderText(options.text, options.data);

      const lines = texts.map(function(lineString) {
        const lineDescriptor = {
          glyphs: [],
          width: 0,
          yMax: 0,
          yMin: 0,
        };

        const lineChars = lineString.split('');
        var x = 0;

        lineChars.forEach(function(char, index) {
          const currentGlyph = glyphStore.getGlyph(char);

          const glyphDescriptor = {
            id: glyphStore.getGlyphId(currentGlyph),
            x: x,
          };

          x += currentGlyph.advanceWidth;

          if (options.kerning && index + 1 < lineChars.length) {
            const nextGlyph = glyphStore.getGlyph(lineChars[index + 1]);
            x += font.getKerningValue(currentGlyph, nextGlyph) || 0;
          }

          if (options.letterSpacing) {
            x += options.letterSpacing * font.unitsPerEm;
          }

          if (currentGlyph.yMax > lineDescriptor.yMax) {
            lineDescriptor.yMax = currentGlyph.yMax;
          }

          if (currentGlyph.yMin < lineDescriptor.yMin) {
            lineDescriptor.yMin = currentGlyph.yMin;
          }

          lineDescriptor.width = glyphDescriptor.x +
            currentGlyph.leftSideBearing +
            (currentGlyph.xMax - currentGlyph.xMin);

          lineDescriptor.glyphs.push(glyphDescriptor);
        });

        return lineDescriptor;
      });

      const absoluteLineHeight = options.lineHeight * font.unitsPerEm;
      const firstBaseline = Math.max(
        font.ascender + font.descender / 2,
        lines[0].yMax
      );

      const bottomOffset = Math.min(
        font.descender,
        lines[lines.length - 1].yMin
      );

      const totalHeight = firstBaseline +
        (texts.length - 1) * absoluteLineHeight -
        bottomOffset;
      const totalWidth = lines.reduce(
        function(acc, line) {
          if (line.width > acc) {
            return line.width;
          } else {
            return acc;
          }
        },
        0
      );

      var glyphsString;
      const ownGlyphs = glyphStore.getOwnGlyphs();

      if (ownGlyphs.length) {
        glyphsString = '<defs>';

        glyphsString += ownGlyphs.reduce(
          function(acc, glyph) {
            const id = glyphStore.getGlyphId(glyph);
            const path = glyph.getPath(0, 0, font.unitsPerEm);
            const attrs = getAttributesString({
              id: id,
              d: path.toPathData(options.decimalPlaces),
            });
            return acc + '<path ' + attrs + '/>';
          },
          ''
        );

        glyphsString += '</defs>';
      } else {
        glyphsString = '';
      }

      const linesString = lines.reduce(
        function(acc, line, index) {
          var tempLineString = '';
          const y = firstBaseline + absoluteLineHeight * index;

          var xOffset = 0;
          if (options.textAlign === 'right') {
            xOffset = totalWidth - line.width;
          } else if (options.textAlign === 'center') {
            xOffset = (totalWidth - line.width) * 0.5;
          }

          tempLineString += '<g id="line-' + index + '">';

          line.glyphs.forEach(function(glyph) {
            const x = glyph.x + xOffset;
            const attrs = getAttributesString({
              x: x,
              y: y,
              'xlink:href': '#' + glyph.id,
            });
            tempLineString += '<use ' + attrs + '/>';
          });

          tempLineString += '</g>';

          return acc + tempLineString;
        },
        ''
      );

      const fontSizeScale = 1 / font.unitsPerEm * options.size;

      const attrs = getAttributesString(
        options.attrs,
        {
          xmlns: 'http://www.w3.org/2000/svg',
          'xmlns:xlink': 'http://www.w3.org/1999/xlink',
        },
        {
          width: Math.round(fontSizeScale * totalWidth),
          height: Math.round(fontSizeScale * totalHeight),
          viewBox: [0, 0, totalWidth, totalHeight].join(' '),
        }
      );

      const svgString = '<svg ' +
        attrs +
        '>' +
        glyphsString +
        linesString +
        '</svg>';

      callback(null, svgString);
    }
  });
};
