'use strict';

var loaderUtils = require('loader-utils');

module.exports = function getLoaderOptions(loaderContext) {
  return loaderUtils.getOptions(loaderContext);
};
