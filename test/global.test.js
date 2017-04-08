'use strict';

var path = require('path');
var exec = require('child_process').exec;

var execOptions = {
  cwd: path.resolve(__dirname, '..'),
};

describe('global', function() {
  test('should build examples successfully', function() {
    return npmRun('build-examples').then(function(result) {
      expect(result).toBe(true);
    });
  });

  test('should build example-svg-output successfully', function() {
    return npmRun('build-example-svg-output').then(function(result) {
      expect(result).toBe(true);
    });
  });
});

/**
 * @param {string} script
 * @return {Promise}
 */
function npmRun(script) {
  var command = 'npm run ' + script;
  return new Promise(function(resolve, reject) {
    exec(command, execOptions, function(error) {
      if (error) {
        reject(error);
      } else {
        resolve(true);
      }
    });
  });
}
