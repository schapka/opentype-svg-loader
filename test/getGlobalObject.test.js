'use strict';

const getGlobalObject = require('../lib/getGlobalObject');
const getNamespace = require('../lib/getNamespace');

describe('getGlobalObject', function() {
  test('should be a function', function() {
    expect(typeof getGlobalObject).toBe('function');
  });

  test('should expect no arguments', function() {
    expect(getGlobalObject.length).toBe(0);
  });

  test('should return an object', function() {
    const result = getGlobalObject();
    expect(typeof result).toBe('object');
  });

  test('should return existing global object if already defined', function() {
    const globalObject = {};
    global['opentype-svg-loader'] = globalObject;
    const result = getGlobalObject();
    expect(result).toBe(globalObject);
  });

  test('should create new global object if not defined', function() {
    global['opentype-svg-loader'] = undefined;
    const result = getGlobalObject();
    expect(typeof result).toBe('object');
  });

  test('should use correct namespace', function() {
    const result = getGlobalObject();
    expect(result).toBe(global[getNamespace()]);
  });
});
