'use strict';

const flushGlobalObject = require('../lib/flushGlobalObject');
const getGlobalObject = require('../lib/getGlobalObject');
const getNamespace = require('../lib/getNamespace');

describe('flushGlobalObject', function() {
  test('should be a function', function() {
    expect(typeof flushGlobalObject).toBe('function');
  });

  test('should expect no arguments', function() {
    expect(flushGlobalObject.length).toBe(0);
  });

  test('should return an object', function() {
    const result = flushGlobalObject();
    expect(typeof result).toBe('object');
  });

  test('should always create new global object', function() {
    const old = getGlobalObject();
    const result = flushGlobalObject();
    expect(old !== result).toBe(true);
  });

  test('should use correct namespace', function() {
    const result = flushGlobalObject();
    expect(result).toBe(global[getNamespace()]);
  });
});
