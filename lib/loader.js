'use strict';

var getOptions = require('./getOptions');
var renderSVG = require('./renderSVG');

/**
 * @param {string} content
 */
module.exports = function opentypeSVGLoader(content) {
  var loaderContext = this;

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
