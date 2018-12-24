'use strict'
/* global expect, R */

describe('HTML_CMNT', function () {

  it('must match valid html comments', function () {
    var html = [
      '<!DOCTYPE html><!--[if lt IE 7]>',
      '  <html class="no-js lt-ie9 lt-ie8 lt-ie7">',
      ' <![endif]-->',
      '<!-- comment 1 --><!--comment 2--><!--x-- >',
      '<html lang="en">',
      '<head><meta charset="UTF-8"><title>Document</title></head>',
      '<body><!--><!----></body><!--',
      '-->',
      '</html>',
    ].join('\n')

    var result = html.match(R.HTML_CMNT)
    expect(result[0]).toBe('<!--[if lt IE 7]>\n  <html class="no-js lt-ie9 lt-ie8 lt-ie7">\n <![endif]-->')
    expect(result[1]).toBe('<!-- comment 1 -->')
    expect(result[2]).toBe('<!--comment 2-->')
    expect(result[3]).toBe('<!--x-- >')
    expect(result[4]).toBe('<!-->')
    expect(result[5]).toBe('<!---->')
    expect(result[6]).toBe('<!--\n-->')
  })

})

describe('JS_REGEX', function () {
  var re = R.JS_REGEX

  it('must recognize simple regexes', function () {
    var str = [
      '/1/',
      '/\\*/',
      '/\\//',
      '/$/',
      '/^/'
    ]
    str.forEach(function (s) {
      expect(s.match(re)).toEqual(s)
    })
  })

  it('must include the flags', function () {
    var str = '/./gimuys'

    expect(str.match(re)).toEqual([str])
    expect((str + '=').match(re)).toEqual([str])
  })

  it('must not confuse with comments', function () {
    var str = [
      '//g',
      '/**///.',
      '/**/g',
    ]
    str.forEach(function (s) {
      expect(s.match(re)).toEqual(null)
    })

    expect('/\\**/'.match(re)).toEqual(['/\\**/'])
  })

  it('must not match if the regex contains EOLs', function () {
    var str = [
      '/a\n/',
      '/a\r/',
      '/a[\n]/',
      '/a[]\r/',
    ]
    str.forEach(function (s) {
      expect(s.match(re)).toEqual(null)
    })

    expect('/a\\n/'.match(re)).toEqual(['/a\\n/'])
  })

  it('must handle escaped and unscaped slashes inside brackets', function () {
    var mm

    mm = '/[/]///'.match(re)
    expect(mm).toBeAn('array')
    expect(mm[0]).toBe('/[/]/')

    mm = '/[\\/]///'.match(re)
    expect(mm).toBeAn('array')
    expect(mm[0]).toBe('/[\\/]/')

    mm = '/[[/]///'.match(re)
    expect(mm).toBeAn('array')
    expect(mm[0]).toBe('/[[/]/')

    mm = '/[/][/]/'.match(re)
    expect(mm).toBeAn('array')
    expect(mm[0]).toBe('/[/][/]/')
  })

  it('must handle escaped brackets', function () {
    var mm

    mm = '/\\[/]/'.match(re)
    expect(mm).toBeAn('array')
    expect(mm[0]).toBe('/\\[/')

    mm = '/\\[[/]/'.match(re)
    expect(mm).toBeAn('array')
    expect(mm[0]).toBe('/\\[[/]/')

    mm = '/[[/]/'.match(re)
    expect(mm).toBeAn('array')
    expect(mm[0]).toBe('/[[/]/')

    mm = '/[\\]]/'.match(re)
    expect(mm).toBeAn('array')
    expect(mm[0]).toBe('/[\\]]/')

    mm = '/[[\\]]/'.match(re)
    expect(mm).toBeAn('array')
    expect(mm[0]).toBe('/[[\\]]/')
  })

  it('must handle escaped line-endings', function () {
    expect('/\\r/').toEqual(['/\\r/'])
    expect('/[\\n]/').toEqual(['/[\\n]/'])
  })

  it('must handle unicode line-endings', function () {
    expect('/\\u2028/').toEqual(['/\\u2028/'])
    expect('/\\\u2028/').toEqual(['/\\\u2028/'])
    expect('/[\\u2028]/').toEqual(['/[\\u2028]/'])
    expect('/\\u2029/').toEqual(['/\\u2029/'])
    expect('/\\\u2029/').toEqual(['/\\\u2029/'])
    expect('/[\\u2029]/').toEqual(['/[\\u2029]/'])
  })

  it('must handle hex and unicode characters', function () {
    var str = [
      '/\x00/',
      '/[\x00]/',
      '/\u001d/',
      '/\\u000d/'
    ]
    str.forEach(function (s) {
      expect(s.match(re)).toEqual([s])
    })
  })

  it('must include the regex flags', function () {
    expect('/./g'.match(re)).toBeAn('array').toInclude('/./g')
    expect('/./yg'.match(re)).toBeAn('array').toInclude('/./yg')
    expect('/./g$'.match(re)).toBeAn('array').toInclude('/./g')
  })

  it('must match the first regex in the same line', function () {
    var mm

    mm = '/.//./'.match(re)
    expect(mm).toBeAn('array')
    expect(mm[0]).toBe('/./')
    expect(mm.index).toBe(0)

    mm = '/[/]/+/./'.match(re)
    expect(mm).toBeAn('array')
    expect(mm[0]).toBe('/[/]/')
    expect(mm.index).toBe(0)

    mm = '5 + /./.lastIndex'.match(re)
    expect(mm).toBeAn('array')
    expect(mm[0]).toBe('/./')
    expect(mm.index).toBe(4)
  })

})

describe('JS_REGEX_P', function () {

  var RE = RegExp(R.JS_REGEX_P.source)

  it('must skip JavaScript comments', function () {
    var ss = [
      '// This is a comment',
      '( /* and this */ );',
      '/regex/'
    ]
    var result = ss.join('\n').match(RE)

    expect(result).toBeAn(Array)
    expect(result[1]).toBe(';\n')
    expect(result[0]).toBe(';\n/regex/')
  })

  it('must skip regex inside quotes', function () {
    var ss = '"/noregex/"'

    expect(ss.match(RE)).toBe(null)
  })

  it('must skip divisor operator', function () {
    var ss = 'var s=10\n /one/ 1"'

    expect(ss.match(RE)).toBe(null)
  })

  it('must not match previous increment/decrement operator', function () {
    var ss = 's++ /one/ 1"'

    expect(ss.match(RE)).toBe(null)
  })

  it('must match own increment/decrement operator', function () {
    var ss = '++ /one/.exec(s).lastIndex"'

    expect(ss.match(RE)).toExist()
  })
})

describe('JS_DQSTR', function () {
  var re = R.JS_DQSTR

  it('must match empty double quoted strings', function () {
    var str = ['""', '"\t"']

    str.forEach(function (s) {
      expect(s.match(re)).toEqual([s])
    })
  })

  it('must match consecutive double quoted string', function () {
    var aa = [
      ['""', '""'],
      ['"a"', '""'],
      ['""', '"b"'],
      ['"a"', '"b"']
    ]
    aa.map(function (p) { return p.join('') })
      .forEach(function (s, ix) {
        expect(s.match(re)).toEqual(aa[ix])
      })
  })

  it('must handle embedded single quotes', function () {
    var str = [
      '"\'"',
      '"\'a\'"',
      '"\\\'"',
      '"\\\'\'"'
    ]
    str.forEach(function (s) {
      expect(s.match(re)).toEqual([s])
    })
  })

  it('must skip inner escaped double quotes', function () {
    var str = [
      '"\\""',
      '"foo\\"bar"',
      '"a\\"\\"b"'
    ]
    str.forEach(function (s) { expect(s.match(re)).toEqual([s]) })
  })

  it('must allow lineContinuation within strings', function () {
    var str = '"a\\\na\\\ra\\\r\na"'
    expect(str.match(re)).toEqual([str])
  })

  it('must allow unicode LS and PS within strings', function () {
    var str = '"\u2028\u2029"'
    expect(str.match(re)).toEqual([str])
  })

  it('must not match unclosed strings', function () {
    var str = [
      '"',
      '"\n"',
      '"foo',
      'a"a',
      '"\'',
    ]
    str.forEach(function (s) { expect(s.match(re)).toEqual(null) })
  })

})

describe('JS_SQSTR', function () {
  var re = R.JS_SQSTR

  it('must match empty single quoted strings', function () {
    var str = ["''", "'\t'"]

    str.forEach(function (s) {
      expect(s.match(re)).toEqual([s])
    })
  })

  it('must match consecutive single quoted string', function () {
    var aa = [
      ["''", "''"],
      ["'a'", "''"],
      ["''", "'a'"],
      ["'a'", "'b'"]
    ]
    aa.map(function (p) { return p.join('') })
      .forEach(function (s, ix) {
        expect(s.match(re)).toEqual(aa[ix])
      })
  })

  it('must handle embedded double quotes', function () {
    var str = [
      "'\"\"'",
      "'\"a\"'",
      "'\\\"'",
      "'\\\"\"'"
    ]
    str.forEach(function (s) {
      expect(s.match(re)).toEqual([s])
    })
  })

  it('must skip inner escaped single quotes', function () {
    var str = [
      "'\\''",
      "'foo\\'bar'",
      "'a\\'\\'b'"
    ]
    str.forEach(function (s) { expect(s.match(re)).toEqual([s]) })
  })

  it('must allow lineContinuation within strings', function () {
    var str = "'a\\\na\\\ra\\\r\na'"
    expect(str.match(re)).toEqual([str])
  })

  it('must allow unicode LS and PS within strings', function () {
    var str = "'\u2028\u2029'"
    expect(str.match(re)).toEqual([str])
  })

  it('must not match unclosed strings', function () {
    var str = [
      "'",
      "'\n'",
      "'foo",
      "a'a",
      "'\"",
    ]
    str.forEach(function (s) { expect(s.match(re)).toEqual(null) })
  })

})

describe('JS_STRING', function () {
  var re = R.JS_STRING

  it('must match empty strings', function () {
    expect('""'.match(re)).toEqual(['""'])
    expect("''".match(re)).toEqual(["''"])
  })

  it('must match consecutive string', function () {
    expect('""\'\''.match(re)).toEqual(['""', "''"])
    expect('"a"\'\''.match(re)).toEqual(['"a"', "''"])
    expect('""\'b\''.match(re)).toEqual(['""', "'b'"])
    expect('\'a\'"b"'.match(re)).toEqual(["'a'", '"b"'])
  })

  it('must not match unclosed strings', function () {
    expect('"\'\''.match(re)).toEqual(["''"])
    expect('\'"'.match(re)).toEqual(null)
  })

})

describe('NON_EMPTY_LINES', function () {
  var re = R.NON_EMPTY_LINES

  it('must match non-empty lines and its line-ending', function () {
    expect('x'.match(re)).toEqual(['x'])
    expect('x '.match(re)).toEqual(['x '])
    expect(' x'.match(re)).toEqual([' x'])
    expect('\n x'.match(re)).toEqual([' x'])
    expect('\n x\n'.match(re)).toEqual([' x\n'])
    expect('x \n'.match(re)).toEqual(['x \n'])
    expect('x\r'.match(re)).toEqual(['x\r'])
    expect('x\r\n'.match(re)).toEqual(['x\r\n'])
    expect('\tx'.match(re)).toEqual(['\tx'])
    expect('\tx\n\n'.match(re)).toEqual(['\tx\n'])
    expect('\n \n  \n\t \n x\n\nx  \n x '.match(re)).toEqual([' x\n', 'x  \n', ' x '])
    expect('\n \n \n\t \n x\nx \t \n\n '.match(re)).toEqual([' x\n', 'x \t \n'])
  })

  it('must not match empty lines', function () {
    expect(''.match(re)).toEqual(null)
    expect(' '.match(re)).toEqual(null)
    expect('\r'.match(re)).toEqual(null)
    expect('\n'.match(re)).toEqual(null)
    expect('\f\t\n'.match(re)).toEqual(null)
    expect('\t\n\n'.match(re)).toEqual(null)
    expect('\t \n'.match(re)).toEqual(null)
    expect('\n '.match(re)).toEqual(null)
    expect('\n \n '.match(re)).toEqual(null)
  })
})

describe('EMPTY_LINES', function () {
  var re = R.EMPTY_LINES

  it('must match empty lines and its line-ending', function () {
    expect(' '.match(re)).toEqual([' '])
    expect('\n'.match(re)).toEqual(['\n'])
    expect('\n '.match(re)).toEqual(['\n', ' '])
    expect(' \n'.match(re)).toEqual([' \n'])
    expect(' \n '.match(re)).toEqual([' \n', ' '])
    expect('\na\nb'.match(re)).toEqual(['\n'])
    expect('\r\r\n\r\r'.match(re)).toEqual(['\r', '\r\n', '\r', '\r'])
    expect('\n  \r \n\n '.match(re)).toEqual(['\n', '  \r', ' \n', '\n', ' '])
    expect(' \n  \r\n\t\n '.match(re)).toEqual([' \n', '  \r\n', '\t\n', ' '])
    expect('\n \n \n\t \n x\nx \t \n\n  '.match(re)).toEqual(['\n', ' \n', ' \n', '\t \n', '\n', '  '])
  })

  it('must not match non-empty lines', function () {
    expect(''.match(re)).toEqual(null)
    expect('a'.match(re)).toEqual(null)
    expect('a\n'.match(re)).toEqual(null)
    expect('a\nb'.match(re)).toEqual(null)
    expect('a\nb\n'.match(re)).toEqual(null)
  })

})

describe('TRAILING_WS', function () {
  var re = R.TRAILING_WS

  it('must not match line-endings', function () {
    expect('\r'.match(re)).toEqual(null)
    expect('\n'.match(re)).toEqual(null)
    expect('\r\n'.match(re)).toEqual(null)
    expect('\u2028'.match(re)).toEqual(null)
    expect('\u2029'.match(re)).toEqual(null)
  })

  it('must match trailing whitespace', function () {
    expect(' '.match(re)).toEqual([' '])
    expect(' \n'.match(re)).toEqual([' '])
    expect('x\n '.match(re)).toEqual([' '])
    expect('\n x '.match(re)).toEqual([' '])
    expect('\t\n'.match(re)).toEqual(['\t'])
    expect('\t\n '.match(re)).toEqual(['\t', ' '])
    expect('\v\f\n'.match(re)).toEqual(['\v\f'])
    expect(' \n \n \n\n\n'.match(re)).toEqual([' ', ' ', ' '])
    expect('\n\v\n \f\n\t \n x\n \nx\n x '.match(re)).toEqual(['\v', ' \f', '\t ', ' ', ' '])
  })

  it('must recognize any line-ending', function () {
    expect(' \r \r\n'.match(re)).toEqual([' ', ' '])
    expect(' \r\n \r'.match(re)).toEqual([' ', ' '])
    expect(' \u2028 '.match(re)).toEqual([' ', ' '])
    expect(' \u2029 '.match(re)).toEqual([' ', ' '])
    expect(' \r \r\n \u2028 \u2029\n'.match(re)).toEqual([' ', ' ', ' ', ' '])
  })

  it('must match trailing unicode whitespace', function () {
    expect('\xA0'.match(re)).toEqual(['\xA0'])
    expect('\uFEFF'.match(re)).toEqual(['\uFEFF'])
    expect('\xA0\n\uFEFF'.match(re)).toEqual(['\xA0', '\uFEFF'])
    expect('\xA0\n\uFEFF\n\xA0\n'.match(re)).toEqual(['\xA0', '\uFEFF', '\xA0'])
  })

  it('must not match lines without trailing whitespace', function () {
    expect(''.match(re)).toEqual(null)
    expect('\n'.match(re)).toEqual(null)
    expect('\n\n'.match(re)).toEqual(null)
    expect(' x'.match(re)).toEqual(null)
    expect('x\n'.match(re)).toEqual(null)
    expect('\n x'.match(re)).toEqual(null)
    expect('\n x\n'.match(re)).toEqual(null)
  })

})

describe('OPT_WS_EOL', function () {
  var re = R.OPT_WS_EOL

  it('must match lonely line-endings', function () {
    expect('\r'.search(re)).toBe(0)
    expect('\n'.search(re)).toBe(0)
    expect('\r\n'.search(re)).toBe(0)
  })

  it('must match unicode line-endings', function () {
    expect('\u2028'.search(re)).toBe(0)
    expect('\u2029'.search(re)).toBe(0)
  })

  it('must match trailing whitespace without line-ending', function () {
    expect(' '.match(re)).toEqual([' '])
    expect('\t'.match(re)).toEqual(['\t'])
    expect('\v'.match(re)).toEqual(['\v'])
    expect(' \t \v '.match(re)).toEqual([' \t \v '])
    expect('x\n '.match(re)).toEqual(['\n', ' '])
    expect('\n x '.match(re)).toEqual(['\n', ' '])
    expect(' \n '.match(re)).toEqual([' \n', ' '])
  })

  it('must match trailing whitespace and line-ending', function () {
    expect(' \n'.match(re)).toEqual([' \n'])
    expect('\t\n'.match(re)).toEqual(['\t\n'])
    expect('\t\n '.match(re)).toEqual(['\t\n', ' '])
    expect(' \v\f\n'.match(re)).toEqual([' \v\f\n'])
    expect(' \n \n\n'.match(re)).toEqual([' \n', ' \n', '\n'])
    expect('x \rx'.match(re)).toEqual([' \r'])
    expect('\n x\n \nx\n x\t'.match(re)).toEqual(['\n', '\n', ' \n', '\n', '\t'])
  })

  it('must recognize mixed line-endings', function () {
    expect(' \r \r\n'.match(re)).toEqual([' \r', ' \r\n'])
    expect(' \r\n \r'.match(re)).toEqual([' \r\n', ' \r'])
    expect('\u2028\u2029'.match(re)).toEqual(['\u2028', '\u2029'])
    expect(' \r \r\n \u2028 \u2029\n'.match(re)).toEqual([' \r', ' \r\n', ' \u2028', ' \u2029', '\n'])
  })

  it('must match trailing unicode whitespace', function () {
    expect('\xA0'.match(re)).toEqual(['\xA0'])
    expect('\uFEFF'.match(re)).toEqual(['\uFEFF'])
    expect('\xA0\n\uFEFF'.match(re)).toEqual(['\xA0\n', '\uFEFF'])
    expect('\xA0\n\uFEFF\n\xA0\n'.match(re)).toEqual(['\xA0\n', '\uFEFF\n', '\xA0\n'])
    expect(' \xA0\t\uFEFF\f\xA0\v'.match(re)).toEqual([' \xA0\t\uFEFF\f\xA0\v'])
  })

  it('must not match strings without trailing whitespace', function () {
    expect(''.match(re)).toEqual(null)
    expect('x'.match(re)).toEqual(null)
    expect(' x'.match(re)).toEqual(null)
    expect('\t\vx'.match(re)).toEqual(null)
    expect(' x\n\n x'.match(re)).toEqual(['\n', '\n'])
  })

})

describe('EOL', function () {
  var re = R.EOL

  it('must match any EOL type', function () {
    expect('\n'.match(re)).toEqual(['\n'])
    expect('\r'.match(re)).toEqual(['\r'])
    expect('\r\n'.match(re)).toEqual(['\r\n'])
    expect('\u2028'.match(re)).toEqual(['\u2028'])
    expect('\u2029'.match(re)).toEqual(['\u2029'])
  })

  it('must match any combination of EOLs', function () {
    expect('\r\r\n'.match(re)).toEqual(['\r', '\r\n'])
    expect('\r\n\n'.match(re)).toEqual(['\r\n', '\n'])
    expect('\n\n\r'.match(re)).toEqual(['\n', '\n', '\r'])
    expect('\r\n\r\n\r\r'.match(re)).toEqual(['\r\n', '\r\n', '\r', '\r'])
    expect('\u2028\r\n\u2029\n'.match(re)).toEqual(['\u2028', '\r\n', '\u2029', '\n'])
  })

})
