'use strict';

const getOptions = require('./getOptions');
const renderSVG = require('./renderSVG');
const getCompilationId = require('./getCompilationId');

/**
 * @param {string} content
 */
module.exports = function opentypeSVGLoader(content) {
  const loaderContext = this;

  if (loaderContext.cacheable) {
    loaderContext.cacheable();
  }

  const callback = loaderContext.async();
  const options = getOptions(loaderContext, content);
  const compilationId = getCompilationId(loaderContext._compilation);

  renderSVG(options, compilationId, function(error, svgString) {
    if (error) {
      callback(error);
    } else {
      const result = 'module.exports = ' + JSON.stringify(svgString);
      callback(null, result);
    }
  });
};
