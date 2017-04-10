'use strict';

const getCompilationId = require('../lib/getCompilationId');

describe('getCompilationId', function() {
  test('should be a function', function() {
    expect(typeof getCompilationId).toBe('function');
  });

  test('should expect one argument', function() {
    expect(getCompilationId.length).toBe(1);
  });

  test('should return a string', function() {
    const result = getCompilationId({});
    expect(typeof result).toBe('string');
  });

  test('should return different ids for different objects', function() {
    const result1 = getCompilationId({});
    const result2 = getCompilationId({});
    expect(result1 === result2).toBe(false);
  });
});
