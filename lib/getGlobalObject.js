'use strict';

const getNamespace = require('./getNamespace');

const ns = getNamespace();

/**
 * @return {Object}
 */
module.exports = function getGlobalObject() {
  global[ns] = global[ns] || {};
  return global[ns];
};
