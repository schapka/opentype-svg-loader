'use strict';

const getNamespace = require('./getNamespace');
const getGlobalObject = require('./getGlobalObject');

const ns = getNamespace();

module.exports = function flushGlobalObject() {
  if (global[ns]) {
    global[ns] = undefined;
  }
  return getGlobalObject();
};
