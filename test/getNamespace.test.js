'use strict';

var getNamespace = require('../lib/getNamespace');

describe('getNamespace', function() {
  test('should be a function', function() {
    expect(typeof getNamespace).toBe('function');
  });

  test('should expect no arguments', function() {
    expect(getNamespace.length).toBe(0);
  });

  test('should return "opentype-svg-loader"', function() {
    var result = getNamespace();
    expect(result).toBe('opentype-svg-loader');
  });
});
