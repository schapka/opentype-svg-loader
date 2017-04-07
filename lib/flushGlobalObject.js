'use strict';

var getNamespace = require('./getNamespace');
var getGlobalObject = require('./getGlobalObject');

var ns = getNamespace();

module.exports = function flushGlobalObject() {
  if (global[ns]) {
    global[ns] = undefined;
  }
  return getGlobalObject();
};
