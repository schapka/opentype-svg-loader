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

      var absoluteLineHeight = options.lineHeight * options.size;

      var firstBaseline = (font.ascender + font.descender / 2) /
        font.unitsPerEm *
        options.size;

      var bottomOffset = font.descender / font.unitsPerEm * options.size;

      var totalHeight = firstBaseline +
        (texts.length - 1) * absoluteLineHeight -
        bottomOffset;

      var paths = texts.map(function(tempText, index) {
        var y = firstBaseline + absoluteLineHeight * index;
        return font.getPath(tempText, 0, y, options.size, {
          kerning: options.kerning,
        });
      });

      var bounds = paths.map(function(tempPath) {
        return tempPath.getBoundingBox();
      });

      var widthValues = bounds.map(function(tempBounds) {
        return tempBounds.x2;
      });

      var totalWidth = Math.max.apply(null, widthValues);

      var viewBox = [0, 0, totalWidth, totalHeight];

      var attrsString = Object.keys(options.attrs).reduce(
        function(acc, tempKey) {
          return acc +
            tempKey +
            '=' +
            JSON.stringify(options.attrs[tempKey]) +
            ' ';
        },
        ''
      );

      var value = '<svg viewBox="' +
        viewBox.join(' ') +
        '" ' +
        attrsString +
        '>' +
        paths.reduce(
          function(acc, tempPath, index) {
            var tempBounds = bounds[index];
            var translateX = 0;
            var pathData = tempPath.toPathData(options.decimalPlaces);

            if (options.textAlign === 'right') {
              translateX = totalWidth - tempBounds.x2;
            } else if (options.textAlign === 'center') {
              translateX = (totalWidth - tempBounds.x2) * 0.5;
            }

            return acc +
              '<path id="line-' +
              index +
              '" transform="translate(' +
              translateX +
              ')" d="' +
              pathData +
              '"></path>';
          },
          ''
        ) +
        '</svg>';

      var result = 'module.exports = ' + JSON.stringify(value);
      callback(null, result);
    }
  });
};
