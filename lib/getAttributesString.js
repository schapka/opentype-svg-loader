'use strict';

const merge = require('webpack-merge');

const escapeMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '`': '&#x60;',
  '=': '&#x3D;',
};

function escapeBadChars(chr) {
  return escapeMap[chr] || chr;
}

const testBadChars = new RegExp(
  '(' + Object.keys(escapeMap).join('|') + ')',
  'g'
);

/**
 * @param {...{}} data
 * @return {string}
 */
module.exports = function getAttributesString(data) {
  const attrs = merge.apply(null, [{}].concat([].slice.call(arguments)));
  return Object.keys(attrs)
    .filter(function(tempKey) {
      return attrs[tempKey] !== undefined;
    })
    .map(function(tempKey) {
      const tempValue = attrs[tempKey];
      const type = tempValue === null ? 'null' : typeof tempValue;

      var stringified;
      switch (type) {
        case 'object':
          stringified = JSON.stringify(tempValue).replace(
            testBadChars,
            escapeBadChars
          );
          break;
        case 'string':
          stringified = tempValue.replace(testBadChars, escapeBadChars);
          break;
        default:
          stringified = tempValue;
          break;
      }

      return tempKey + '="' + stringified + '"';
    })
    .join(' ');
};
