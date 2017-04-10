'use strict';

const shortid = require('shortid');

const getGlobalObject = require('./getGlobalObject');

/**
 * @param {*} compilation
 * @return {string}
 */
module.exports = function getCompilationId(compilation) {
  const globalObject = getGlobalObject();
  globalObject.compilations = globalObject.compilations || [];

  if (compilation) {
    var i = 0;
    while (i < globalObject.compilations.length) {
      const tempItem = globalObject.compilations[i];
      if (tempItem.compilation === compilation) {
        return tempItem.id;
      }
      i++;
    }
  }

  /**
   * @type {{id: (string), compilation: (*)}}
   */
  const newItem = {
    id: shortid.generate(),
    compilation: compilation || {},
  };

  globalObject.compilations.push(newItem);

  return newItem.id;
};
