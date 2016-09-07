[![Build Status][build-image]][build-url]
[![npm Version][npm-image]][npm-url]
[![License][license-image]][license-url]

# perf-regexes

Optimized and powerful regexes for JavaScript

## Install

```sh
npm install perf-regexes --save
```

Regexes included matches...

Regex name | Description | Note
---------- | ----------- | --------
`JS_MLCOMM` | Valid multiline JS comment | Excludes invalid comments like `/*/`, supports nested `'/*'`
`JS_SLCOMM` | Single line JS comment | From the `//` to the (but not including) next EOL
`JS_STRING` | Single and double quoted JS string | Handles nested quotes and escaped eols
`JS_DIVISOR` | Division operator and closing html tag | To skip non-regex slashes
`JS_REGEX` | Literal regex | It captures the last slash in `$1`
`HTML_COMM` | Valid HTML comments | HTML comments can be used in browsers with JavaScript
`ISCOMMENT` | The start of a comment | For both, HTML and JS comments, with no `g` option.

Except `ISCOMMENT`, all the regexes has the `'g'` option and nothing more, so you can use it with `exec` or `replace`

Please note that you don't need the `'m'`, pref-regexes works with Win/Mac/Unix EOLs with no problems, but if you like use the `RegExp` constructor with the `source` property to recrate the regex like in the example.

**Note:**

Because the `'g'`, always set `lastIndex = 0` before using a regex with the `exec` method.

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
    _R.JS_DIVISOR.source,
    _R.JS_REGEX.source].join('|'), 'gm');

  return source.replace(re, match => {
    return _R.ISCOMMENT.test(match) ? ' ' : match
  })
}
```

## ES6 Template Strings

There's another regex to detect ES6 template strings but it is not recommended since there's no way to parse nested ES6 template strings with the limited regex engine of JavaScript.

This is an example of a complex, valid ES6 string:

```js
let silly = `foo ${ "`" + '`' + `\`${ { bar }.baz }\`` }`
```

## Known issues

`JS_REGEXES` fail with literal regexes starting with `//` or `/>`, please follow the best-practices and use `/\/` or `/\>`.

[build-image]:    https://img.shields.io/travis/aMarCruz/perf-regexes.svg
[build-url]:      https://travis-ci.org/aMarCruz/perf-regexes
[npm-image]:      https://img.shields.io/npm/v/perf-regexes.svg
[npm-url]:        https://www.npmjs.com/package/perf-regexes
[license-image]:  https://img.shields.io/npm/l/express.svg
[license-url]:    https://github.com/aMarCruz/perf-regexes/blob/master/LICENSE
