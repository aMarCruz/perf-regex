/**
 * @module perf-regexes
 *
 * Optimized and powerful regexes for JavaScript
 */
/* eslint-disable max-len */

/** Matches valid multiline JS comments */
export const JS_MLCOMM = /\/\*[^*]*\*+(?:[^*\/][^*]*\*+)*\//g

/** Single line JS comments */
export const JS_SLCOMM = /\/\/[^\n\r]*/g

/** Single and double quoted strings, take care about embedded eols */
export const JS_STRING = /"[^"\n\r\\]*(?:\\(?:\r\n?|[\S\s])[^"\n\r\\]*)*"|'[^'\n\r\\]*(?:\\(?:\r\n?|[\S\s])[^'\n\r\\]*)*'/g

/** Allow skip division operators and closing html tags to detect non-regex slashes */
export const JS_DIVISOR = /(?:\b(?:return|yield|in|of)\s+|<\/[-a-zA-Z]|(?:[$\w\)\]]|\+\+|--)\s*\/(?![*\/]))/g

/** Matches literal regexes -- $1 last slash of the regex */
export const JS_REGEX = /\/(?=[^*\/\n\r>])[^[\n\r/\\]*(?:(?:\[(?:\\[^\n\r]|[^\]\n\r\\]*)*\]|\\.)[^[/\n\r\\]*)*?(\/)[gim]*/g

/** Matches valid HTML comments (ES6 code can have this) */
export const HTML_COMM = /<!--(?!>)[\S\s]*?-->/g

/** Matches the start of a comment */
export const ISCOMMENT = /^(?:<--|\/[*\/])/

/** Matches trailing spaces of lines */
export const TRAILING_SPACES = /[ \t\f\v]*$/gm

/** Matches empty lines */
export const EMPTY_LINES = /^[ \t\f\v]*$/gm

/** Matches empty lines */
export const NON_EMPTY_LINES = /^[ \t\f\v]*\S.*/mg

/**
 * ES6 template strings (not recommended).
 * This is for very limited strings, since there's no way to parse
 * nested ES6 strings with regexes.
 *
 * This is a valid ES6 string: `foo ${ "`" + '`' + `\`${ { bar }.baz }` }`
 */
export const ES6_TSTR_SIMPLE = /`[^`\\]*(?:\\[\S\s][^`\\]*)*`/g
