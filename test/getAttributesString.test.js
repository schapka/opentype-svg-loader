'use strict';

var getAttributesString = require('../lib/getAttributesString');

describe('getAttributesString', function() {
  test('should be a function', function() {
    expect(typeof getAttributesString).toBe('function');
  });

  test('should return an string', function() {
    var result = getAttributesString();
    expect(typeof result).toBe('string');
  });

  test('should return a valid attributes string including merged', function() {
    var result = getAttributesString({ a: 'a' }, { b: 'b' });
    expect(result).toBe('a="a" b="b"');
  });
});
