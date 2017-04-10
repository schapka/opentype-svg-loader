'use strict';

const shortid = require('shortid');
const getGlobalObject = require('./getGlobalObject');

const isTrue = RegExp.prototype.test.bind(/(^true$|^1$)/i);
const isFalse = RegExp.prototype.test.bind(/(^false$|^$|^0$)/i);

/**
 * @param {OpenTypeSVGLoaderOptions} options
 * @param {opentype.Font} font
 * @param {string} compilationId
 * @return {{getGlyph: getGlyph, getOwnGlyphs: getOwnGlyphs, getGlyphId: getGlyphId}}
 */
module.exports = function getGlyphStore(options, font, compilationId) {
  var storeId;
  if (isTrue(options.sharedGlyphStore)) {
    storeId = 'default';
  } else if (isFalse(options.sharedGlyphStore)) {
    storeId = shortid.generate();
  } else {
    storeId = options.sharedGlyphStore;
  }

  const sanitizedFontName = options.font
    .replace(/[\s]+/i, '_')
    .toLocaleLowerCase();
  const clientId = shortid.generate();
  const globalObject = getGlobalObject();
  const storeKey = compilationId + ':' + storeId + ':' + sanitizedFontName;
  const store = globalObject[storeKey] || (globalObject[storeKey] = []);

  /**
   * @param {string} char
   * @return {opentype.Glyph}
   */
  function getGlyph(char) {
    var i = 0;
    while (i < store.length) {
      const storeItem = store[i];
      if (storeItem.char === char) {
        return storeItem.glyph;
      }
      i++;
    }

    const newStoreItem = {
      clientId: clientId,
      char: char,
      glyph: font.charToGlyph(char),
    };

    store.push(newStoreItem);

    return newStoreItem.glyph;
  }

  /**
   * @return {Array.<opentype.Glyph>}
   */
  function getOwnGlyphs() {
    return store
      .filter(function(storeItem) {
        return storeItem.clientId === clientId;
      })
      .map(function(storeItem) {
        return storeItem.glyph;
      });
  }

  /**
   * @param {opentype.Glyph} glyph
   * @return {string}
   */
  function getGlyphId(glyph) {
    return storeId + ':' + sanitizedFontName + ':' + glyph.index;
  }

  return {
    getGlyph: getGlyph,
    getOwnGlyphs: getOwnGlyphs,
    getGlyphId: getGlyphId,
  };
};
