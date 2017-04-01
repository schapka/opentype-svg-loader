'use strict';

module.exports = function getOptionsFromContent( content ) {
  if ( typeof content === 'string' ) {
    try {
      return JSON.parse( content );
    } catch ( _ ) {
      return {
        text: content
      }
    }
  } else {
    return content;
  }
};
