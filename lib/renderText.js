'use strict';

var mustache = require( 'mustache' );

/**
 * @param {string|Array.<string>} text
 * @param {Object} [data]
 * @return {Array.<string>}
 */
module.exports = function renderText( text, data ) {
  var template = '';
  var view = typeof data === 'object' ? data : {};

  if ( Object.prototype.toString.call( text ) === '[object Array]' ) {
    template = text.join( '\n' );
  } else if ( typeof text === 'string' ) {
    template = text;
  }

  return mustache.render( template, view ).split( '\n' );
};
