'use strict';

var getGlyphStore = require('../lib/getGlyphStore');

describe('getGlyphStore', function() {
  test('should export a function', function() {
    expect(typeof getGlyphStore).toBe('function');
  });

  test('should expect three arguments', function() {
    expect(getGlyphStore.length).toBe(3);
  });

  /*
   * TODO write additional tests
   */
});