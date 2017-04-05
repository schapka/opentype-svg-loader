'use strict';

var opentype = require('opentype.js');
var merge = require('webpack-merge');

var getDefaultOptions = require('./getDefaultOptions');
var getLoaderOptions = require('./getLoaderOptions');
var getOptionsFromQuery = require('./getOptionsFromQuery');
var getOptionsFromContent = require('./getOptionsFromContent');
var renderText = require('./renderText');

/**
 * @param {string} content
 */
module.exports = function opentypeSVGLoader(content) {
  if (this.cacheable) {
    this.cacheable();
  }

  var callback = this.async();

  var options = merge(
    getDefaultOptions(),
    getLoaderOptions(this),
    getOptionsFromQuery(this.resourceQuery),
    getOptionsFromContent(content)
  );

  if (!options.font) {
    if (options.fonts) {
      options.font = Object.keys(options.fonts)[0];
    }
  }

  opentype.load(options.fonts[options.font], function(error, font) {
    if (error) {
      callback(error);
    } else {
      var texts = renderText(options.text, options.data);

      var glyphs = {};

      var lines = texts.map(function(lineString) {
        var lineDescriptor = {
          glyphs: [],
          width: 0,
        };

        var lineChars = lineString.split('');
        var x = 0;

        lineChars.forEach(function(char, index) {
          var currentGlyph = glyphs[char];

          if (currentGlyph === void 0) {
            currentGlyph = font.charToGlyph(char);
            glyphs[char] = currentGlyph;
          }

          var glyphDescriptor = {
            name: currentGlyph.name,
            x: x,
          };

          var kerning = 0;

          if (options.kerning && index + 1 < lineChars.length) {
            var nextChar = lineChars[index + 1];
            var nextGlyph = glyphs[nextChar];

            if (nextGlyph === void 0) {
              nextGlyph = font.charToGlyph(nextChar);
              glyphs[nextChar] = nextGlyph;
            }
            kerning = font.getKerningValue(currentGlyph, nextGlyph) || 0;
          }

          x += currentGlyph.advanceWidth + kerning;

          lineDescriptor.width = glyphDescriptor.x +
            currentGlyph.leftSideBearing +
            (currentGlyph.xMax - currentGlyph.xMin);
          lineDescriptor.glyphs.push(glyphDescriptor);
        });

        return lineDescriptor;
      });

      var absoluteLineHeight = options.lineHeight * font.unitsPerEm;
      var firstBaseline = font.ascender + font.descender / 2;
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

      var viewBoxString = [0, 0, totalWidth, totalHeight].join(' ');

      var defsString = '<defs>' +
        Object.keys(glyphs).reduce(
          function(acc, key) {
            var glyph = glyphs[key];
            var path = glyph.getPath(0, 0, font.unitsPerEm);
            return acc +
              '<path id="' +
              glyph.name +
              '" d="' +
              path.toPathData(options.decimalPlaces) +
              '"/>';
          },
          ''
        ) +
        '</defs>';

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
              glyph.name +
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
      });

      var attrsString = Object.keys(attrs).reduce(
        function(acc, tempKey) {
          return acc + tempKey + '=' + JSON.stringify(attrs[tempKey]) + ' ';
        },
        ''
      );

      var value = '<svg viewBox="' +
        viewBoxString +
        '" ' +
        attrsString +
        '>' +
        defsString +
        linesString +
        '</svg>';

      var result = 'module.exports = ' + JSON.stringify(value);
      callback(null, result);
    }
  });
};
