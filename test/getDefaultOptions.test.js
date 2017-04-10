'use strict';

const getDefaultOptions = require('../lib/getDefaultOptions');

describe('getDefaultOptions', function() {
  test('should be a function', function() {
    expect(typeof getDefaultOptions).toBe('function');
  });

  test('should expect no arguments', function() {
    expect(getDefaultOptions.length).toBe(0);
  });

  test('should return an object', function() {
    const result = getDefaultOptions();
    expect(typeof result).toBe('object');
  });

  test('should have correct default values', function() {
    const result = getDefaultOptions();
    expect(result.fonts).toBe(null);
    expect(result.data).toEqual({});
    expect(result.text).toBe('');
    expect(result.font).toBe(null);
    expect(result.size).toBe(72);
    expect(result.lineHeight).toBe(1.0);
    expect(result.letterSpacing).toBe(0.0);
    expect(result.textAlign).toBe('left');
    expect(result.decimalPlaces).toBe(2);
    expect(result.kerning).toBe(true);
    expect(result.attrs).toEqual({});
    expect(result.sharedGlyphStore).toBe(true);
  });
});
