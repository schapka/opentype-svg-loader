'use strict';

/**
 * @typedef {Object} OpenTypeSVGLoaderOptions
 * @property {{}} fonts
 * @property {{}} data
 * @property {string|Array.<string>} text
 * @property {string} font
 * @property {number} size
 * @property {number} lineHeight
 * @property {number} letterSpacing
 * @property {'left'|'center'|'right'} textAlign
 * @property {number} decimalPlaces
 * @property {boolean} kerning
 * @property {{}} attrs
 * @property {boolean} sharedGlyphStore
 */

/**
 * @type {OpenTypeSVGLoaderOptions}
 */
const defaultOptions = {
  fonts: null,
  data: {},
  text: '',
  font: null,
  size: 72,
  lineHeight: 1.0,
  letterSpacing: 0.0,
  textAlign: 'left',
  decimalPlaces: 2,
  kerning: true,
  attrs: {},
  sharedGlyphStore: true,
};

/**
 * @return {OpenTypeSVGLoaderOptions}
 */
module.exports = function getDefaultOptions() {
  return defaultOptions;
};
