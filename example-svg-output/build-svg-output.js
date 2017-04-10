'use strict';

const path = require('path');
const fs = require('fs');

const glob = require('glob');
const merge = require('webpack-merge');
const shortid = require('shortid');

const getDefaultOptions = require('../lib/getDefaultOptions');
const renderSVG = require('../lib/renderSVG');

const fontsDir = path.resolve(__dirname, '..', 'fonts');
const outputDir = path.resolve(__dirname, 'output');
const sharedOptions = merge(getDefaultOptions(), {
  size: 24,
  lineHeight: 1.2,
  textAlign: 'center',
  text: [
    'The European languages are members of the same family.',
    'Their separate existence is a myth.',
    'For science, music, sport, etc,',
  ],
});

glob(path.join(fontsDir, '*', '*.{ttf,otf}'), function(error, files) {
  if (error) {
    throw error;
  } else {
    files.forEach(function(fontFile, index) {
      const fontName = path
        .basename(fontFile)
        .replace(/\.(ttf|otf)/i, '')
        .replace(/[\s]+/i, '-')
        .toLowerCase();

      const outputFile = fontName + '.svg';
      const outputFilePath = path.resolve(outputDir, outputFile);

      const fonts = {};
      fonts[fontName] = fontFile;

      const options = merge(sharedOptions, {
        fonts: fonts,
        font: fontName,
        sharedGlyphStore: 's' + index,
      });

      renderSVG(options, shortid.generate(), function(error, svgString) {
        if (error) {
          console.log('Failed creating: "' + outputFile + '"');
          process.exit(1);
        } else {
          fs.writeFile(outputFilePath, svgString, 'utf8', function(error) {
            if (error) {
              console.log('Failed creating: "' + outputFile + '"');
              process.exit(1);
            } else {
              console.log('Created: "' + outputFile + '"');
            }
          });
        }
      });
    });
  }
});
