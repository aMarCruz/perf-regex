[![Build Status][build-image]][build-url]
[![npm Version][npm-image]][npm-url]
[![License][license-image]][license-url]

# perf-regexes

Optimized and powerful regexes for JavaScript

## Install

```sh
npm install perf-regexes --save
```

## Included Regexes

Name | Description | Note
---- | ----------- | --------
`JS_MLCMNT` | Valid multiline JS comment | Excludes invalid comments like `/*/`, supports nested `'/*'`
`JS_SLCMNT` | Single line JS comment | From the `//` to the (but not including) next EOL
`JS_STRING` | Single and double quoted JS string | Handles nested quotes and escaped eols
`JS_REGEX` | Literal regex | Can match a divisor, so the match must be validated
`JS_REGEX_P` | Literal regex | Captures a prefix in $1, the regex is not captured
`HTML_CMNT` | Valid HTML comments | HTML comments with `<!--` and `-->` delimiters

All the regexes has the option `'g'` and nothing more, so you can use it with `exec` or `replace`.

You don't need the option `'m'`, perf-regexes works with Win/Mac/Unix EOLs with no problems, but if you like use the `RegExp` constructor with the `source` property to recrate the regex like in the example.

> **NOTE:**
>
> Because the `'g'`, always set `lastIndex` before using a regex with the `exec` method.


## Example

```js
/*
  Comments removal made easy.
  ...but please don't use this for ES6 template strings
*/
const _R = require('perf-regexes')

function removeComments(source) {
  const re = new RegExp([
    _R.JS_MLCOMM.source,
    _R.JS_SLCOMM.source,
    _R.JS_STRING.source,
    _R.JS_REGEX_P.source].join('|'), 'gm');

  return source.replace(re, match => {
    return /^\/[/\*]/.test(match) ? ' ' : match
  })
}
```

## Matching Regexes

It is not easy. Depending on code complexity, `JS_REGEX_P` can do the work with 99% accuracy, but you need handle the prefix captured in $1.

Also, this fail matching literal regexes starting with `//` or `/>`, please follow the best-practices and use `/\/` or `/\>`.


## ES6 Template Strings

There's no secure way to match ES6 Template Literals with regexes.


[build-image]:    https://img.shields.io/travis/aMarCruz/perf-regexes.svg
[build-url]:      https://travis-ci.org/aMarCruz/perf-regexes
[npm-image]:      https://img.shields.io/npm/v/perf-regexes.svg
[npm-url]:        https://www.npmjs.com/package/perf-regexes
[license-image]:  https://img.shields.io/npm/l/express.svg
[license-url]:    https://github.com/aMarCruz/perf-regexes/blob/master/LICENSE
