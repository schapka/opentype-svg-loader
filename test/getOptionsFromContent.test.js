'use strict';

const getOptionsFromContent = require('../lib/getOptionsFromContent');

describe('getOptionsFromContent', function() {
  test('should be a function', function() {
    expect(typeof getOptionsFromContent).toBe('function');
  });

  test('should expect one argument', function() {
    expect(getOptionsFromContent.length).toBe(1);
  });

  test('should return an object', function() {
    const result = getOptionsFromContent('');
    expect(typeof result).toBe('object');
  });

  test('should handle json input', function() {
    const input = {
      text: 'Hello World!',
      kerning: true,
    };
    const result = getOptionsFromContent(JSON.stringify(input));
    expect(typeof result).toBe('object');
    expect(result.text).toBe('Hello World!');
    expect(result.kerning).toBe(true);
  });

  test('should use text input as text value', function() {
    const input = 'Hello World!';
    const result = getOptionsFromContent(input);
    expect(typeof result).toBe('object');
    expect(result.text).toBe('Hello World!');
  });
});
