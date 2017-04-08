'use strict';

var path = require('path');

var glob = require('glob');
var webpack = require('webpack');

var examplesDir = path.resolve(__dirname);

var compilerCount = 0;
var successCount = 0;
var errorCount = 0;

function handleCompilerComplete(error, stats) {
  if (error) {
    errorCount++;
  } else if (stats.hasErrors()) {
    errorCount++;
  } else {
    successCount++;
  }
  if (errorCount + successCount >= compilerCount) {
    process.exit(errorCount > 0 ? 1 : 0);
  }
}

glob(path.join(examplesDir, '*', 'webpack.config.js'), function(error, files) {
  if (error) {
    throw error;
  } else {
    files.forEach(function(configFile) {
      compilerCount++;
      var config = require(configFile);
      var compiler = webpack(config);
      compiler.run(handleCompilerComplete);
    });
  }
});
