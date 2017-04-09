'use strict';

var opentype = require('opentype.js');

var getGlyphStore = require('./getGlyphStore');
var renderText = require('./renderText');
var getAttributesString = require('./getAttributesString');

/**
 * @param {OpenTypeSVGLoaderOptions} options
 * @param {Function} callback
 * @return {string}
 */
module.exports = function renderSVG(options, callback) {
  opentype.load(options.fonts[options.font], function(error, font) {
    if (error) {
      callback(error);
    } else {
      var glyphStore = getGlyphStore(
        options.sharedGlyphStore,
        font,
        options.font
      );

      var texts = renderText(options.text, options.data);

      var lines = texts.map(function(lineString) {
        var lineDescriptor = {
          glyphs: [],
          width: 0,
          yMax: 0,
          yMin: 0,
        };

        var lineChars = lineString.split('');
        var x = 0;

        lineChars.forEach(function(char, index) {
          var currentGlyph = glyphStore.getGlyph(char);

          var glyphDescriptor = {
            id: glyphStore.getGlyphId(currentGlyph),
            x: x,
          };

          x += currentGlyph.advanceWidth;

          if (options.kerning && index + 1 < lineChars.length) {
            var nextGlyph = glyphStore.getGlyph(lineChars[index + 1]);
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

      var absoluteLineHeight = options.lineHeight * font.unitsPerEm;
      var firstBaseline = Math.max(
        font.ascender + font.descender / 2,
        lines[0].yMax
      );

      var bottomOffset = Math.min(font.descender, lines[lines.length - 1].yMin);

      var totalHeight = firstBaseline +
        (texts.length - 1) * absoluteLineHeight -
        bottomOffset;
      var totalWidth = lines.reduce(
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
      var ownGlyphs = glyphStore.getOwnGlyphs();

      if (ownGlyphs.length) {
        glyphsString = '<defs>';

        glyphsString += ownGlyphs.reduce(
          function(acc, glyph) {
            var id = glyphStore.getGlyphId(glyph);
            var path = glyph.getPath(0, 0, font.unitsPerEm);
            var attrs = getAttributesString({
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

      var linesString = lines.reduce(
        function(acc, line, index) {
          var tempLineString = '';
          var y = firstBaseline + absoluteLineHeight * index;

          var xOffset = 0;

          if (options.textAlign === 'right') {
            xOffset = totalWidth - line.width;
          } else if (options.textAlign === 'center') {
            xOffset = (totalWidth - line.width) * 0.5;
          }

          tempLineString += '<g id="line-' + index + '">';

          line.glyphs.forEach(function(glyph) {
            var x = glyph.x + xOffset;
            var attrs = getAttributesString({
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

      var fontSizeScale = 1 / font.unitsPerEm * options.size;

      var attrs = getAttributesString(
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

      var svgString = '<svg ' +
        attrs +
        '>' +
        glyphsString +
        linesString +
        '</svg>';

      callback(null, svgString);
    }
  });
};
