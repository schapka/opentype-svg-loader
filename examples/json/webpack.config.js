'use strict';

const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'entry.js'),

  output: {
    path: path.resolve(__dirname, 'public', 'dist'),
    filename: '[name].bundle.js',
  },

  module: {
    rules: [
      {
        test: /\.ot\.json$/,
        use: [
          {
            loader: 'opentype-svg-loader',
            options: {
              fonts: {
                YellowtailRegular: path.resolve(
                  __dirname,
                  '..',
                  '..',
                  'fonts',
                  'Yellowtail',
                  'Yellowtail-Regular.ttf'
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
