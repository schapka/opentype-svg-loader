'use strict';

const loaderUtils = require('loader-utils');
const merge = require('webpack-merge');

const getDefaultOptions = require('./getDefaultOptions');
const getOptionsFromQuery = require('./getOptionsFromQuery');
const getOptionsFromContent = require('./getOptionsFromContent');

/**
 * @param loaderContext
 * @param content
 * @return {OpenTypeSVGLoaderOptions}
 */
module.exports = function getOptions(loaderContext, content) {
  const defaultOptions = getDefaultOptions();
  const loaderOptions = loaderUtils.getOptions(loaderContext);
  const queryOptions = getOptionsFromQuery(loaderContext.resourceQuery);
  const contentOptions = getOptionsFromContent(content);

  const options = merge(
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
