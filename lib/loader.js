'use strict';

const getOptions = require('./getOptions');
const renderSVG = require('./renderSVG');
const getGlobalObject = require('./getGlobalObject');
const flushGlobalObject = require('./flushGlobalObject');

/**
 * @param {string} content
 */
module.exports = function opentypeSVGLoader(content) {
  const loaderContext = this;

  var globalObject = getGlobalObject();
  if (
    globalObject.compilation !== void 0 &&
    globalObject.compilation !== loaderContext._compilation
  ) {
    globalObject = flushGlobalObject();
  }
  globalObject.compilation = loaderContext._compilation;

  if (loaderContext.cacheable) {
    loaderContext.cacheable();
  }

  const callback = loaderContext.async();
  const options = getOptions(loaderContext, content);

  renderSVG(options, function(error, svgString) {
    if (error) {
      callback(error);
    } else {
      const result = 'module.exports = ' + JSON.stringify(svgString);
      callback(null, result);
    }
  });
};
