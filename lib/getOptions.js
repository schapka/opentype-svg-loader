'use strict';

var loaderUtils = require('loader-utils');
var merge = require('webpack-merge');

var getDefaultOptions = require('./getDefaultOptions');
var getOptionsFromQuery = require('./getOptionsFromQuery');
var getOptionsFromContent = require('./getOptionsFromContent');

/**
 * @param loaderContext
 * @param content
 * @return {OpenTypeSVGLoaderOptions}
 */
module.exports = function getOptions(loaderContext, content) {
  var defaultOptions = getDefaultOptions();
  var loaderOptions = loaderUtils.getOptions(loaderContext);
  var queryOptions = getOptionsFromQuery(loaderContext.resourceQuery);
  var contentOptions = getOptionsFromContent(content);

  var options = merge(
    defaultOptions,
    loaderOptions,
    queryOptions,
    contentOptions
  );

  if (!options.font) {
    if (options.fonts) {
      options.font = Object.keys(options.fonts)[0];
    }
  }

  return options;
};
