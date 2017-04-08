'use strict';

var merge = require('webpack-merge');

/**
 * @param {...{}} data
 * @return {string}
 */
module.exports = function getAttributesString(data) {
  var attrs = merge.apply(null, [{}].concat([].slice.call(arguments)));
  return Object.keys(attrs)
    .map(function(tempKey) {
      var tempValue = attrs[tempKey];
      if (tempValue === undefined) {
        return '';
      } else if (
        tempValue === null ||
        tempValue === true ||
        tempValue === false ||
        typeof tempValue === 'number'
      ) {
        return tempKey + '="' + JSON.stringify(tempValue) + '"';
      } else {
        return tempKey + '=' + JSON.stringify(tempValue);
      }
    })
    .join(' ');
};
