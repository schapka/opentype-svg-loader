'use strict';

var getGlobalObject = require('../lib/getGlobalObject');

describe('getGlobalObject', function() {
  test('should be a function', function() {
    expect(typeof getGlobalObject).toBe('function');
  });

  test('should expect no arguments', function() {
    expect(getGlobalObject.length).toBe(0);
  });

  test('should return an object', function() {
    var result = getGlobalObject();
    expect(typeof result).toBe('object');
  });

  test('should return existing global object if already defined', function() {
    var globalObject = {};
    global['opentype-svg-loader'] = globalObject;
    var result = getGlobalObject();
    expect(result).toBe(globalObject);
  });

  test('should create new global object if not defined', function() {
    delete global['opentype-svg-loader'];
    var result = getGlobalObject();
    expect(typeof result).toBe('object');
  });

  test('should use correct namespace', function() {
    var result = getGlobalObject();
    expect(result).toBe(global['opentype-svg-loader']);
  });
});
