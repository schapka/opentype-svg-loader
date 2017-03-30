'use strict';

var findInObject = require( './findInObject' );

/**
 * @param {string|Array.<string>} text
 * @param {Object} [data]
 * @return {Array.<string>}
 */
module.exports = function renderText( text, data ) {
  data = typeof data === 'object' ? data : {};

  if ( Object.prototype.toString.call( text ) === '[object Array]' ) {
    text = text.join( '\n' ).split( '\n' );
  } else if ( typeof text === 'string' ) {
    text = text.split( '\n' );
  } else {
    text = [];
  }

  return text
    .map( function ( tempText ) {
      return tempText.replace( /{{[\s]*([^{}]+)[\s]*}}/g, function ( _, placeholder ) {
        return findInObject( placeholder, data );
      } )
    } );
};
