'use strict';

var ns = 'opentype-svg-loader';

module.exports = function getGlobalObject() {
  global[ns] = global[ns] || {};
  return global[ns];
};
