'use strict';

var headlineSVGString = require( './headline.ot.json' );
var wrapperEl = document.getElementById( 'mount' );
wrapperEl.innerHTML = headlineSVGString;
