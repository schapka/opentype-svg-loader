'use strict';

var defaultOptions = {
  fonts: null,
  data: {},
  text: '',
  font: null,
  size: 72,
  lineHeight: 1.0,
  letterSpacing: 0.0,
  textAlign: 'left',
  decimalPlaces: 2,
  kerning: true,
  attrs: {},
  sharedGlyphStore: true,
};

module.exports = function getDefaultOptions() {
  return defaultOptions;
};
