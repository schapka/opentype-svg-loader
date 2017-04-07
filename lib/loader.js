'use strict';

var getOptions = require('./getOptions');
var renderSVG = require('./renderSVG');
var getGlobalObject = require('./getGlobalObject');
var flushGlobalObject = require('./flushGlobalObject');

/**
 * @param {string} content
 */
module.exports = function opentypeSVGLoader(content) {
  var loaderContext = this;

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

  var callback = loaderContext.async();
  var options = getOptions(loaderContext, content);

  renderSVG(options, function(error, svgString) {
    if (error) {
      callback(error);
    } else {
      var result = 'module.exports = ' + JSON.stringify(svgString);
      callback(null, result);
    }
  });
};
