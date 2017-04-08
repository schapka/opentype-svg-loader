'use strict';

var getOptions = require('../lib/getOptions');

describe('getOptions', function() {
  test('should export a function', function() {
    expect(typeof getOptions).toBe('function');
  });

  test('should expect one argument', function() {
    expect(getOptions.length).toBe(2);
  });
});
