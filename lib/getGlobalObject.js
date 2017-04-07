'use strict';

var getNamespace = require('./getNamespace');

var ns = getNamespace();

module.exports = function getGlobalObject() {
  global[ns] = global[ns] || {};
  return global[ns];
};
