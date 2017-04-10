'use strict';

const mustache = require('mustache');

/**
 * @param {(string|Array.<string>)} text
 * @param {Object} [data]
 * @return {Array.<string>}
 */
module.exports = function renderText(text, data) {
  const view = typeof data === 'object' ? data : {};

  var template = '';
  if (Object.prototype.toString.call(text) === '[object Array]') {
    template = text.join('\n');
  } else if (typeof text === 'string') {
    template = text;
  }

  return mustache.render(template, view).split('\n');
};
