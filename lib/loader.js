'use strict';

var loaderUtils = require( 'loader-utils' );
var opentype = require( 'opentype.js' );
var renderText = require( './renderText' );

var defaultOptions = {
  fonts: null,
  data: {}
};

var defaultDef = {
  text: '',
  font: null,
  size: 72,
  lineHeight: 1.0,
  textAlign: 'left',
  decimalPlaces: 2,
  kerning: true,
  attrs: {}
};

/**
 * @param {string} content
 */
module.exports = function opentypeSVGLoader( content ) {
  if( this.cacheable ) {
    this.cacheable();
  }

  var callback = this.async();

  var options = Object.assign(
    defaultOptions,
    loaderUtils.getOptions( this )
  );

  var def = Object.assign(
    defaultDef,
    typeof content === 'string' ? JSON.parse( content ) : content
  );

  opentype.load( options.fonts[ def.font ], function ( error, font ) {
    if ( error ) {
      callback( error );
    } else {
      var texts = renderText( def.text, options.data );

      var paths = texts.map( function ( tempText ) {
        return font.getPath( tempText, 0, 0, def.size, { kerning: def.kerning } )
      } );

      var bounds = paths.map( function ( tempPath ) {
        var boundingBox = tempPath.getBoundingBox();
        return {
          x: boundingBox.x1,
          y: boundingBox.y1,
          width: boundingBox.x2 - boundingBox.x1,
          height: boundingBox.y2 - boundingBox.y1
        };
      } );

      var widthValues = bounds.map( function ( tempBounds ) {
        return tempBounds.width;
      } );
      var width = Math.max.apply( null, widthValues );
      var itemHeight = def.size * def.lineHeight;
      var height = itemHeight * texts.length;

      var viewBox = [
        0,
        0,
        width,
        height
      ];

      var attrsString = Object.keys( def.attrs ).reduce( function ( acc, tempKey ) {
        return acc + tempKey + '=' + JSON.stringify( def.attrs[ tempKey ] ) + ' '
      }, '' );

      var value = '<svg viewBox="' + viewBox.join( ' ' ) + '" ' + attrsString + '>' + paths.reduce( function ( acc, tempPath, index ) {
            var tempBounds = bounds[ index ];
            var translateX = tempBounds.x * -1;
            var translateY = ( ( tempBounds.y * -1 ) + itemHeight * index );
            var pathData = tempPath.toPathData( def.decimalPlaces );

            if ( def.textAlign === 'right' ) {
              translateX += width - tempBounds.width;
            } else if ( def.textAlign === 'center' ) {
              translateX += ( width - tempBounds.width ) * 0.5;
            }

            return acc + '<path id="line-' + index + '" transform="translate(' + translateX + ',' + translateY + ')" d="' + pathData + '"></path>';
          },
          '' ) + '</svg>';

      var result = 'module.exports = ' + JSON.stringify( value );
      callback( null, result );
    }
  } );
};
