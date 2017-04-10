'use strict';

const getGlyphStore = require('../lib/getGlyphStore');

describe('getGlyphStore', function() {
  test('should export a function', function() {
    expect(typeof getGlyphStore).toBe('function');
  });

  test('should expect three arguments', function() {
    expect(getGlyphStore.length).toBe(3);
  });
});
