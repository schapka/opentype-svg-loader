'use strict';

/**
 * @param {string} path
 * @param {Object} data
 * @return {*}
 */
module.exports = function findInObject( path, data ) {
  var paths = path.split( '/' );
  var i = 0;
  while ( i < paths.length ) {
    data = data[ paths[ i ] ];
    if ( !data ) {
      return path;
    }
    i++;
  }
  return data;
};
