'use strict';

const path = require('path');

const glob = require('glob');
const webpack = require('webpack');
const merge = require('webpack-merge');

const examplesDir = path.resolve(__dirname);

var compilerCount = 0;
var successCount = 0;
var errorCount = 0;

function handleCompilerComplete(error, stats) {
  if (error) {
    console.log('Failed compiling: "' + this.name + '"');
    errorCount++;
  } else if (stats.hasErrors()) {
    console.log('Failed compiling: "' + this.name + '"');
    errorCount++;
  } else {
    console.log('Compiled: "' + this.name + '"');
    successCount++;
  }
  if (errorCount + successCount >= compilerCount) {
    process.exit(errorCount > 0 ? 1 : 0);
  }
}

const sharedConfig = {
  resolveLoader: {
    alias: {
      'opentype-svg-loader': path.resolve(__dirname, '..'),
    },
  },
};

glob(path.join(examplesDir, '*', 'webpack.config.js'), function(error, files) {
  if (error) {
    throw error;
  } else {
    files.forEach(function(configFile) {
      compilerCount++;

      const config = merge({}, require(configFile), sharedConfig, {
        name: path.basename(path.dirname(configFile)),
      });

      const compiler = webpack(config);
      compiler.run(handleCompilerComplete.bind(compiler));
    });
  }
});
