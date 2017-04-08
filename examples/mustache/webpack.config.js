'use strict';

var path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'entry.js'),

  output: {
    path: path.resolve(__dirname, 'public', 'dist'),
    filename: '[name].bundle.js',
  },

  resolveLoader: {
    alias: {
      'opentype-svg-loader': path.resolve(__dirname, '..', '..'),
    },
  },

  module: {
    rules: [
      {
        test: /\.ot\.mustache/,
        use: [
          {
            loader: 'opentype-svg-loader',
            options: {
              fonts: {
                PermanentMarker: path.resolve(
                  __dirname,
                  '..',
                  '..',
                  'fonts',
                  'Permanent_Marker',
                  'PermanentMarker.ttf'
                ),
              },
              data: {
                greeting: 'Hello',
                name: 'World',
              },
            },
          },
        ],
      },
    ],
  },
};
