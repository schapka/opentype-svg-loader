'use strict';

var shortid = require('shortid');
var getFontName = require('./getFontName');
var getGlobalObject = require('./getGlobalObject');

var testTrue = /(^true$|^1$)/i;
var testFalse = /(^false$|^$|^0$)/i;

/**
 * @param {string} sharedGlyphStore
 * @param {*} font
 * @return {{getGlyph: getGlyph, getOwnGlyphs: getOwnGlyphs, getGlyphId: getGlyphId}}
 */
module.exports = function getGlyphStore(sharedGlyphStore, font) {
  var storeId;

  if (testTrue.test(sharedGlyphStore)) {
    storeId = 'default';
  } else if (testFalse.test(sharedGlyphStore)) {
    storeId = shortid.generate();
  } else {
    storeId = sharedGlyphStore;
  }

  var clientId = shortid.generate();
  var fontName = getFontName(font);
  var globalObject = getGlobalObject();
  var storeKey = storeId + ':' + fontName;
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
    return storeKey + ':' + glyph.name;
  }

  return {
    getGlyph: getGlyph,
    getOwnGlyphs: getOwnGlyphs,
    getGlyphId: getGlyphId,
  };
};
