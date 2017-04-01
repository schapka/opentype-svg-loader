'use strict';

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
  attrs: {},
};

module.exports = function getDefaultOptions() {
  return defaultOptions;
};
