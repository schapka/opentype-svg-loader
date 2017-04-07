'use strict';

var path = require('path');
var fs = require('fs');

var glob = require('glob');
var merge = require('webpack-merge');

var getDefaultOptions = require('../lib/getDefaultOptions');
var renderSVG = require('../lib/renderSVG');

var fontsDir = path.resolve(__dirname, 'fonts');
var outputDir = path.resolve(__dirname, 'output');
var sharedOptions = merge(getDefaultOptions(), {
  size: 24,
  lineHeight: 1.2,
  textAlign: 'center',
  text: [
    'The European languages are members of the same family.',
    'Their separate existence is a myth.',
    'For science, music, sport, etc,',
  ],
  sharedGlyphStore: false,
});

glob(path.join(fontsDir, '*', '*.{ttf,otf}'), function(error, files) {
  if (error) {
    throw error;
  } else {
    files.forEach(function(fontFile) {
      var fontName = path
        .basename(fontFile)
        .replace(/\.(ttf|otf)/i, '')
        .replace(/[\s]+/i, '-')
        .toLowerCase();

      var outputFile = path.resolve(outputDir, fontName + '.svg');

      var fonts = {};
      fonts[fontName] = fontFile;

      var options = merge(sharedOptions, {
        fonts: fonts,
        font: fontName,
      });

      renderSVG(options, function(error, svgString) {
        if (!error && svgString) {
          fs.writeFile(outputFile, svgString, 'utf8', function(error) {
            if (error) {
              console.log(error);
              process.exit(1);
            }
          });
        }
      });
    });
  }
});
