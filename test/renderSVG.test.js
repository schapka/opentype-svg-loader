'use strict';

const renderSVG = require('../lib/renderSVG');

describe('renderSVG', function() {
  test('should export a function', function() {
    expect(typeof renderSVG).toBe('function');
  });

  test('should expect two arguments', function() {
    expect(renderSVG.length).toBe(2);
  });
});
