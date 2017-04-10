'use strict';

const loaderUtils = require('loader-utils');

const queryParamsMap = {
  fonts: toObjectParam,
  data: toObjectParam,
  font: toStringParam,
  size: toNumberParam,
  lineHeight: toNumberParam,
  letterSpacing: toNumberParam,
  textAlign: toStringParam,
  decimalPlaces: toNumberParam,
  kerning: toBooleanParam,
  attrs: toObjectParam,
  sharedGlyphStore: toStringParam,
};

function toStringParam(value) {
  return '' + value;
}

function toNumberParam(value) {
  return parseFloat(value);
}

function toBooleanParam(value) {
  if (typeof value === 'string') {
    return /^(true|1)$/i.test(value);
  } else {
    return value === true;
  }
}

function toObjectParam(value) {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch (_) {
      return {};
    }
  } else {
    return {};
  }
}

/**
 * @param {string} queryString
 * @return {*}
 */
module.exports = function getOptionsFromQuery(queryString) {
  if (!queryString) {
    return {};
  } else {
    const params = loaderUtils.parseQuery(queryString);
    return Object.keys(params)
      .filter(function(key) {
        return typeof queryParamsMap[key] === 'function';
      })
      .reduce(
        function(acc, key) {
          acc[key] = queryParamsMap[key](params[key]);
          return acc;
        },
        {}
      );
  }
};
