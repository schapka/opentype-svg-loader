'use strict';

const merge = require('webpack-merge');

/**
 * @type {Object.<string, string>}
 */
const escapeMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '`': '&#x60;',
  '=': '&#x3D;',
};

/**
 * @param {string} char
 * @return {string}
 */
function escapeBadChars(char) {
  return escapeMap[char] || char;
}

/**
 * @type {RegExp}
 */
const testBadChars = new RegExp(
  '(' + Object.keys(escapeMap).join('|') + ')',
  'g'
);

/**
 * @param {(Object|Array|string|boolean|number|null)} value
 * @return {string}
 */
function stringify(value) {
  const type = value === null ? 'null' : typeof value;
  switch (type) {
    case 'object':
      return JSON.stringify(value).replace(testBadChars, escapeBadChars);
      break;
    case 'string':
      return value.replace(testBadChars, escapeBadChars);
      break;
    default:
      return value + '';
      break;
  }
}

/**
 * @param {...Object} data
 * @return {string}
 */
module.exports = function getAttributesString(data) {
  const attrs = merge.apply(null, [{}].concat([].slice.call(arguments)));
  return Object.keys(attrs)
    .filter(function(tempKey) {
      return attrs[tempKey] !== undefined;
    })
    .map(function(tempKey) {
      return tempKey + '="' + stringify(attrs[tempKey]) + '"';
    })
    .join(' ');
};
