'use strict';

var flushGlobalObject = require('../lib/flushGlobalObject');
var getGlobalObject = require('../lib/getGlobalObject');
var getNamespace = require('../lib/getNamespace');

describe('flushGlobalObject', function() {
  test('should be a function', function() {
    expect(typeof flushGlobalObject).toBe('function');
  });

  test('should expect no arguments', function() {
    expect(flushGlobalObject.length).toBe(0);
  });

  test('should return an object', function() {
    var result = flushGlobalObject();
    expect(typeof result).toBe('object');
  });

  test('should always create new global object', function() {
    var old = getGlobalObject();
    var result = flushGlobalObject();
    expect(old !== result).toBe(true);
  });

  test('should use correct namespace', function() {
    var result = flushGlobalObject();
    expect(result).toBe(global[getNamespace()]);
  });
});
