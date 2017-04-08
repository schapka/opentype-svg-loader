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

  test('should return a valid attributes string', function() {
    var result = getAttributesString({ a: 'a' });
    expect(result).toBe('a="a"');
  });

  test('should merge data', function() {
    var result = getAttributesString({ a: 'a' }, { b: 'b' });
    expect(result).toBe('a="a" b="b"');
  });

  test('should ignore undefined values', function() {
    var result = getAttributesString({ c: undefined });
    expect(result).toBe('');
  });

  test('should stringify null properly', function() {
    var result = getAttributesString({ a: null });
    expect(result).toBe('a="null"');
  });

  test('should stringify booleans properly', function() {
    var result = getAttributesString({ a: true });
    expect(result).toBe('a="true"');
  });

  test('should stringify numbers properly', function() {
    var result = getAttributesString({ a: 100 });
    expect(result).toBe('a="100"');
  });

  test('should stringify objects properly', function() {
    var result = getAttributesString({ a: { bar: 'foo' } });
    expect(result).toBe('a="{&quot;bar&quot;:&quot;foo&quot;}"');
  });

  test('should stringify arrays properly', function() {
    var result = getAttributesString({ a: ['foo'] });
    expect(result).toBe('a="[&quot;foo&quot;]"');
  });
});
