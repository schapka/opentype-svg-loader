'use strict';

var renderText = require('../lib/renderText');

describe('renderText', function() {
  test('should be a function', function() {
    expect(typeof renderText).toBe('function');
  });

  test('should expect two arguments', function() {
    expect(renderText.length).toBe(2);
  });

  test('should return an array of strings', function() {
    var result = renderText('abc\ndef', {});
    expect(Object.prototype.toString.call(result)).toBe('[object Array]');
    result.forEach(function(line) {
      expect(typeof line).toBe('string');
    });
  });

  test('should split string at line breaks', function() {
    var result = renderText('abc\ndef\nghi', {});
    expect(result.length).toBe(3);
  });

  test('should accept an array as text value', function() {
    var text = ['abc', 'def', 'ghi'];
    var result = renderText(text, {});
    expect(result.length).toBe(3);
  });

  test('should replace placeholders', function() {
    var text = 'Hello {{name}}!';
    var result = renderText(text, { name: 'World' });
    expect(result[0]).toBe('Hello World!');
  });

  test('should removed unused placeholders', function() {
    var text = 'Hello {{name}}!';
    var result = renderText(text, {});
    expect(result[0]).toBe('Hello !');
  });

  test('should support nested data', function() {
    var text = 'Hello {{content.name}}!';
    var result = renderText(text, { content: { name: 'World' } });
    expect(result[0]).toBe('Hello World!');
  });
});
