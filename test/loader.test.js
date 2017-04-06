'use strict';

var loader = require('../lib/loader');

describe('loader', function() {
  test('should export a function', function() {
    expect(typeof loader).toBe('function');
  });

  test('should expect one argument', function() {
    expect(loader.length).toBe(1);
  });

  /*
   * TODO write additional tests
   */
});
