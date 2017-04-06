'use strict';

var headlineSVGString = require('./headline.ot.mustache?textAlign=left&size=12&lineHeight=1.1&letterSpacing=0.0&decimalPlaces=2&attrs={"preserveAspectRatio": "xMaxYMax meet"}&sharedGlyphStore=true');
var wrapperEl = document.getElementById('mount');
wrapperEl.innerHTML = headlineSVGString;
