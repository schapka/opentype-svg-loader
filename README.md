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

`webpack.config.js`

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

`headline.ot.json`

```json
{
  "text": "Hello World!",
  "font": "YellowtailRegular"
}
```

`entry.js`

```javascript
var headlineSVGString = require( './headline.ot.json' );
var wrapperEl = document.getElementById( 'mount' );
wrapperEl.innerHTML = headlineSVGString;
```

## Input file

The input file can either be a text file or a `JSON` file.

In case of a text file its contents will be interpreted as template string (`options.text`).
If the input file is a `JSON` file it can contain any of the available options. 

## Options

Options will be merged in following order:
1. Loader Options
2. Resource Query
3. Input file (in case of a `JSON` input file)

### fonts
Type: `Object`
Default: `null`

An object holding a collection of available fonts. Object keys are used as references. Object values represent absolute paths to font files.

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

A data object handed to mustache.

### text
Type: `String | String[]`
Default: `''`

A template string that will be processed by mustache. If the input file is not a `JSON` file its contents will be interpreted as the template string.

### font
Type: `String`
Default: `null`

A reference to the font that should be used for rendering. Will fallback to the first entry of the font collection (`options.fonts`).

### size
Type: `Number`
Default: `72`

### lineHeight
Type: `Number`
Default: `1.0`

### textAlign
Type: `String`
Default: `'left'`

Possible Options: `'left'` `'center'` `'right'` 

### decimalPlaces
Type: `Number`
Default: `2`

### kerning
Type: `Boolean`
Default: `true`

### attrs
Type: `Object`
Default: `{}`

Attributes that should be added to the `<svg>`-element

```json
{
  "attrs": {
    "preserveAspectRatio": "xMaxYMax meet"
  }
}
```

### sharedGlyphStore
Type: `String`
Default: `'default'`
