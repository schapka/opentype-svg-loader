'use strict';

var opentype = require( 'opentype.js' );
var getOptions = require( './getOptions' );
var renderText = require( './renderText' );

/**
 * @param {string} content
 */
module.exports = function opentypeSVGLoader( content ) {
  if( this.cacheable ) {
    this.cacheable();
  }

  var callback = this.async();

  var options = getOptions( this, content );

  opentype.load( options.fonts[ options.font ], function ( error, font ) {
    if ( error ) {
      callback( error );
    } else {
      var texts = renderText( options.text, options.data );

      var paths = texts.map( function ( tempText ) {
        return font.getPath( tempText, 0, 0, options.size, { kerning: options.kerning } )
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
      var itemHeight = options.size * options.lineHeight;
      var height = itemHeight * texts.length;

      var viewBox = [
        0,
        0,
        width,
        height
      ];

      var attrsString = Object.keys( options.attrs ).reduce( function ( acc, tempKey ) {
        return acc + tempKey + '=' + JSON.stringify( options.attrs[ tempKey ] ) + ' '
      }, '' );

      var value = '<svg viewBox="' + viewBox.join( ' ' ) + '" ' + attrsString + '>' + paths.reduce( function ( acc, tempPath, index ) {
            var tempBounds = bounds[ index ];
            var translateX = tempBounds.x * -1;
            var translateY = ( ( tempBounds.y * -1 ) + itemHeight * index );
            var pathData = tempPath.toPathData( options.decimalPlaces );

            if ( options.textAlign === 'right' ) {
              translateX += width - tempBounds.width;
            } else if ( options.textAlign === 'center' ) {
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
