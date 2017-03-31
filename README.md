# OpenType-SVG-Loader

A loader for webpack that lets you import TrueType and OpenType fonts converted to a SVG string.

## Install

Using `yarn`
```bash
yarn add -D opentype-svg-loader
```

Using `npm`
```bash
npm i -D opentype-svg-loader
```

## Usage

### Webpack configuration - `webpack.config.js`

```javascript
module: {
  rules: [
    {
      test: /\.ot\.json$/,
      use: [
        {
          loader: 'opentype-svg-loader',
          options: {
            fonts: {
              YellowtailRegular: path.resolve( __dirname, 'fonts', 'Yellowtail', 'Yellowtail-Regular.ttf' )
            }
          }
        }
      ]
    }
  ]
}
```

### Definition file - `*.ot.json`

```json
{
  "text": "Hello World!",
  "font": "YellowtailRegular"
}
```

### Import and render

```javascript
var headlineSVGString = require( './headline.ot.json' );
var wrapperEl = document.getElementById( 'mount' );
wrapperEl.innerHTML = headlineSVGString;
```

## Loader options

### fonts
Type: `Object`
Default: `null`

Object holding a collection of available fonts. Object keys are used as font reference in definition files. Object values represent absolute paths to font files.

`webpack.config.js`
```javascript
{
  options: {
    /* ... */
    fonts: {
      MyFontName: '/absolute/path/fo/font-file.ttf'
    }
    /* ... */
  }
}
```

### data
Type: `Object`
Default: `{}`

Data handed to definition file.

`webpack.config.js`
```javascript
{
  options: {
    /* ... */
    data: {
      bar: 'foo'
    }
    /* ... */
  }
}
```

`*.ot.json`
```json
{
  "text": "bar: {{bar}}"
}
```

## Definition object

### text
Type: `String | String[]`
Default: `''`

`*.ot.json`
```json
{
  "text": "bar: {{bar}}"
}
```
`*.ot.json` (multiline)
```json
{
  "text": [
    "bar:",
    "{{bar}}"
  ]
}
```

### font
Type: `String`
Default: `null`

### size
Type: `Number`
Default: `72`

### lineHeight
Type: `Number`
Default: `1.0`

### textAlign
Type: `String`
Default: `'left'`

### decimalPlaces
Type: `Number`
Default: `2`

### kerning
Type: `Boolean`
Default: `true`

### attrs
Type: `Object`
Default: `{}`

`*.ot.json`
```json
{
  "attrs": {
    "preserveAspectRatio": "xMaxYMax meet"
  }
}
```
