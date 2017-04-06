'use strict';

var shortid = require('shortid');
var getGlobalObject = require('./getGlobalObject');

var isTrue = RegExp.prototype.test.bind(/(^true$|^1$)/i);
var isFalse = RegExp.prototype.test.bind(/(^false$|^$|^0$)/i);

/**
 * @param {string|Boolean} sharedGlyphStore
 * @param {*} font
 * @param {string} fontName
 * @return {{getGlyph: getGlyph, getOwnGlyphs: getOwnGlyphs, getGlyphId: getGlyphId}}
 */
module.exports = function getGlyphStore(sharedGlyphStore, font, fontName) {
  var storeId;

  if (isTrue(sharedGlyphStore)) {
    storeId = 'default';
  } else if (isFalse(sharedGlyphStore)) {
    storeId = shortid.generate();
  } else {
    storeId = sharedGlyphStore;
  }

  var sanitizedFontName = fontName.replace(/[\s]+/i, '_').toLocaleLowerCase();
  var clientId = shortid.generate();
  var globalObject = getGlobalObject();
  var storeKey = storeId + ':' + sanitizedFontName;
  var store = globalObject[storeKey] || (globalObject[storeKey] = []);

  function getGlyph(char) {
    var i = 0;
    while (i < store.length) {
      var storeItem = store[i];
      if (storeItem.char === char) {
        return storeItem.glyph;
      }
      i++;
    }

    var newStoreItem = {
      clientId: clientId,
      char: char,
      glyph: font.charToGlyph(char),
    };

    store.push(newStoreItem);

    return newStoreItem.glyph;
  }

  function getOwnGlyphs() {
    return store
      .filter(function(storeItem) {
        return storeItem.clientId === clientId;
      })
      .map(function(storeItem) {
        return storeItem.glyph;
      });
  }

  function getGlyphId(glyph) {
    return storeKey + ':' + glyph.index;
  }

  return {
    getGlyph: getGlyph,
    getOwnGlyphs: getOwnGlyphs,
    getGlyphId: getGlyphId,
  };
};
