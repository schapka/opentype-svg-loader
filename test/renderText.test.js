'use strict';

const renderText = require('../lib/renderText');

describe('renderText', function() {
  test('should be a function', function() {
    expect(typeof renderText).toBe('function');
  });

  test('should expect two arguments', function() {
    expect(renderText.length).toBe(2);
  });

  test('should return an array of strings', function() {
    const result = renderText('abc\ndef', {});
    expect(Object.prototype.toString.call(result)).toBe('[object Array]');
    result.forEach(function(line) {
      expect(typeof line).toBe('string');
    });
  });

  test('should split string at line breaks', function() {
    const result = renderText('abc\ndef\nghi', {});
    expect(result.length).toBe(3);
  });

  test('should accept an array as text value', function() {
    const text = ['abc', 'def', 'ghi'];
    const result = renderText(text, {});
    expect(result.length).toBe(3);
  });

  test('should replace placeholders', function() {
    const text = 'Hello {{name}}!';
    const result = renderText(text, { name: 'World' });
    expect(result[0]).toBe('Hello World!');
  });

  test('should removed unused placeholders', function() {
    const text = 'Hello {{name}}!';
    const result = renderText(text, {});
    expect(result[0]).toBe('Hello !');
  });

  test('should support nested data', function() {
    const text = 'Hello {{content.name}}!';
    const result = renderText(text, { content: { name: 'World' } });
    expect(result[0]).toBe('Hello World!');
  });

  test('should support mustache template tags', function() {
    const data = {
      stooges: [{ name: 'Moe' }, { name: 'Larry' }, { name: 'Curly' }],
    };
    const text = '{{#stooges}}Name: {{name}}\n{{/stooges}}';
    const result = renderText(text, data);
    expect(result[0]).toBe('Name: Moe');
    expect(result[1]).toBe('Name: Larry');
    expect(result[2]).toBe('Name: Curly');
  });
});
