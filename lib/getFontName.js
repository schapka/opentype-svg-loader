'use strict';

/**
 * @param {*} font
 * @return {string}
 */
module.exports = function getFontName(font) {
  return font.names.fullName.en.replace(/[\s]+/i, '_').toLocaleLowerCase();
};
