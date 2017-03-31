'use strict';

var loaderUtils = require( 'loader-utils' );

var defaultOptions = {
  fonts: null,
  data: {},
  text: '',
  font: null,
  size: 72,
  lineHeight: 1.0,
  textAlign: 'left',
  decimalPlaces: 2,
  kerning: true,
  attrs: {}
};

var queryParams = {
  'font': toStringParam,
  'size': toNumberParam,
  'lineHeight': toNumberParam,
  'textAlign': toStringParam,
  'decimalPlaces': toNumberParam,
  'kerning': toBooleanParam
};

/**
 * @param {string|boolean} value
 * @return {string}
 */
function toStringParam( value ) {
  return '' + value;
}

/**
 * @param {string|boolean} value
 * @return {Number}
 */
function toNumberParam( value ) {
  return parseFloat( value );
}

/**
 * @param {string|boolean} value
 * @return {boolean}
 */
function toBooleanParam( value ) {
  if( typeof value === 'string' ) {
    return /^(true|1)$/i.test( value );
  } else {
    return value === true;
  }
}

/**
 * @param loaderContext
 * @param content
 * @return {{fonts: null|{}, data: {}, text: string|[string], font: string, size: number, lineHeight: number, textAlign: string, decimalPlaces: number, kerning: boolean, attrs: {}}}
 */
module.exports = function getOptions( loaderContext, content ) {
  var def;

  if ( typeof content === 'string' ) {
    try {
      def = JSON.parse( content );
    } catch ( _ ) {
      def = {
        text: content
      }
    }
  } else {
    def = content;
  }

  var options = Object.assign(
    defaultOptions,
    loaderUtils.getOptions( loaderContext ),
    def
  );

  if ( !options.font && options.fonts ) {
    options.font = Object.keys( options.fonts )[ 0 ];
  }

  if ( loaderContext.resourceQuery ) {
    var params = loaderUtils.parseQuery( loaderContext.resourceQuery );
    Object.keys( params ).forEach( function ( key ) {
      if ( queryParams[ key ] ) {
        options[ key ] = queryParams[ key ]( params[ key ] );
      } else {
        options.data = options.data || {};
        options.data[ key ] = params[ key ];
      }
    } );
  }

  return options;
};
