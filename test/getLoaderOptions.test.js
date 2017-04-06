'use strict';

var getLoaderOptions = require('../lib/getLoaderOptions');

describe('getLoaderOptions', function() {
  test('should export a function', function() {
    expect(typeof getLoaderOptions).toBe('function');
  });

  test('should expect one argument', function() {
    expect(getLoaderOptions.length).toBe(1);
  });

  /*
   * TODO write additional tests
   */
});
