'use strict';

var getOptionsFromQuery = require('../lib/getOptionsFromQuery');

describe('getOptionsFromQuery', function() {
  test('should be a function', function() {
    expect(typeof getOptionsFromQuery).toBe('function');
  });

  test('should expect one argument', function() {
    expect(getOptionsFromQuery.length).toBe(1);
  });

  test('should return an object', function() {
    var result = getOptionsFromQuery('?bar=foo');
    expect(typeof result).toBe('object');
  });

  test('should ignore extra keys', function() {
    var result = getOptionsFromQuery('?bar=foo');
    expect(result.a).toBe(undefined);
  });

  test('should cast "fonts" to Object', function() {
    var result = getOptionsFromQuery('?fonts={"a":"b"}');
    expect(typeof result.fonts).toBe('object');
  });

  test('should cast "data" to Object', function() {
    var result = getOptionsFromQuery('?data={"a":"b"}');
    expect(typeof result.data).toBe('object');
  });

  test('should cast "size" to Number', function() {
    var result = getOptionsFromQuery('?size=12.5');
    expect(typeof result.size).toBe('number');
  });

  test('should cast "lineHeight" to Number', function() {
    var result = getOptionsFromQuery('?lineHeight=12.5');
    expect(typeof result.lineHeight).toBe('number');
  });

  test('should cast "letterSpacing" to Number', function() {
    var result = getOptionsFromQuery('?letterSpacing=12.5');
    expect(typeof result.letterSpacing).toBe('number');
  });

  test('should cast "decimalPlaces" to Number', function() {
    var result = getOptionsFromQuery('?decimalPlaces=12.5');
    expect(typeof result.decimalPlaces).toBe('number');
  });

  test('should cast "kerning" to Boolean', function() {
    var result = getOptionsFromQuery('?kerning=true');
    expect(typeof result.kerning).toBe('boolean');
  });

  test('should cast "attrs" to Object', function() {
    var result = getOptionsFromQuery('?attrs={"a":"b"}');
    expect(typeof result.attrs).toBe('object');
  });
});
