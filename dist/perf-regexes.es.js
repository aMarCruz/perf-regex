/**
 * @module perf-regexes
 *
 * Optimized and powerful regexes for JavaScript
 */
/* eslint-disable max-len */

// can preceed regex, excludes `throw` and `new` from the keywords
var R_PREFIX =
/((?:(?:^|[[{(,;:?=|&!^~>%*/])\s*[+\-]{0,2}|\.\.|case|default:?|delete|do|else|extends|in|instanceof|prefix|return|typeof|void|yield|[^+]\+|[^\-]-)\s*)/

/** Matches valid multiline JS comments */
var JS_MLCMNT = /\/\*[^*]*\*+(?:[^*\/][^*]*\*+)*\//g

/** Single line JS comments */
var JS_SLCMNT = /\/\/.*/g

/** Single and double quoted strings, take care about embedded eols */
var JS_STRING = /"[^"\n\r\\]*(?:\\(?:\r\n?|[\S\s])[^"\n\r\\]*)*"|'[^'\n\r\\]*(?:\\(?:\r\n?|[\S\s])[^'\n\r\\]*)*'/g

/** Matches literal regexes */
var JS_REGEX = /\/(?=[^*\n\r>/])[^[\n\r/\\]*(?:(?:\[(?:\\.|[^\]\n\r\\]*)*\]|\\.)[^[\n\r\\/]*)*?\/(?=[gimuy]+|[^/\*]|$)/g

/** Matches regex, captures in $1 a prefix, in $2 the regex without options */
var JS_REGEX_P = RegExp(R_PREFIX.source + JS_REGEX.source, 'g')

/** Matches HTML comments */
var HTML_CMNT = /<!--(?:>|[\S\s]*?)-->/g

/** Matches not empty lines */
var NON_EMPTY_LINES = /^.*\S.*$/mg

/** Matches empty lines */
var EMPTY_LINES = /^[ \t\f\v]*$/gm

/** Matches trailing spaces of lines */
var TRAILING_SPACES = /[ \t\f\v]*$/gm

export { JS_MLCMNT, JS_SLCMNT, JS_STRING, JS_REGEX, JS_REGEX_P, HTML_CMNT, NON_EMPTY_LINES, EMPTY_LINES, TRAILING_SPACES };