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
export var JS_MLCMNT = /\/\*[^*]*\*+(?:[^*\/][^*]*\*+)*\//g

/** Single line JS comments */
export var JS_SLCMNT = /\/\/.*/g

/** Single and double quoted strings, take care about embedded eols */
export var JS_STRING = /"[^"\n\r\\]*(?:\\(?:\r\n?|[\S\s])[^"\n\r\\]*)*"|'[^'\n\r\\]*(?:\\(?:\r\n?|[\S\s])[^'\n\r\\]*)*'/g

/** Matches literal regexes */
export var JS_REGEX = /\/(?=[^*\n\r>/])[^[\n\r/\\]*(?:(?:\[(?:\\.|[^\]\n\r\\]*)*\]|\\.)[^[\n\r\\/]*)*?\/(?=[gimuy]+|[^/\*]|$)/g

/** Matches regex, captures in $1 a prefix, in $2 the regex without options */
export var JS_REGEX_P = RegExp(R_PREFIX.source + JS_REGEX.source, 'g')

/** Matches HTML comments */
export var HTML_CMNT = /<!--(?:>|[\S\s]*?)-->/g

/** Matches not empty lines */
export var NON_EMPTY_LINES = /^.*\S.*$/mg

/** Matches empty lines */
export var EMPTY_LINES = /^[ \t\f\v]*$/gm

/** Matches trailing spaces of lines */
export var TRAILING_SPACES = /[ \t\f\v]*$/gm
