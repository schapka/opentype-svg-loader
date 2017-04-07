'use strict';

var opentype = require('opentype.js');
var merge = require('webpack-merge');

var getGlyphStore = require('./getGlyphStore');
var renderText = require('./renderText');

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

          lineDescriptor.width = glyphDescriptor.x +
            currentGlyph.leftSideBearing +
            (currentGlyph.xMax - currentGlyph.xMin);

          lineDescriptor.glyphs.push(glyphDescriptor);
        });

        return lineDescriptor;
      });

      var absoluteLineHeight = options.lineHeight * font.unitsPerEm;
      var firstBaseline = font.ascender + font.descender / 2;
      if (firstBaseline < lines[0].yMax) {
        firstBaseline = lines[0].yMax;
      }

      var bottomOffset = font.descender;
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
            return acc +
              '<path id="' +
              id +
              '" d="' +
              path.toPathData(options.decimalPlaces) +
              '"/>';
          },
          ''
        );

        glyphsString += '</defs>';
      } else {
        glyphsString = '';
      }

      var linesString = lines.reduce(
        function(acc, line, index) {
          var y = firstBaseline + absoluteLineHeight * index;

          var xOffset = 0;

          if (options.textAlign === 'right') {
            xOffset = totalWidth - line.width;
          } else if (options.textAlign === 'center') {
            xOffset = (totalWidth - line.width) * 0.5;
          }

          acc += '<g id="line-' + index + '">';

          line.glyphs.forEach(function(glyph) {
            var x = glyph.x + xOffset;
            acc += '<use x="' +
              x +
              '" y="' +
              y +
              '" xlink:href="#' +
              glyph.id +
              '" />';
          });

          acc += '</g>';

          return acc;
        },
        ''
      );

      var fontSizeScale = 1 / font.unitsPerEm * options.size;

      var attrs = merge({}, options.attrs, {
        width: Math.round(fontSizeScale * totalWidth),
        height: Math.round(fontSizeScale * totalHeight),
        viewBox: [0, 0, totalWidth, totalHeight].join(' '),
      });

      var attrsString = Object.keys(attrs).reduce(
        function(acc, tempKey) {
          return acc + tempKey + '=' + JSON.stringify(attrs[tempKey]) + ' ';
        },
        ''
      );

      var svgString = '<svg ' +
        attrsString +
        '>' +
        glyphsString +
        linesString +
        '</svg>';

      callback(null, svgString);
    }
  });
};
