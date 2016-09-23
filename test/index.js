// TODO: more tests
var expect = require('expect')
var _R = require('../')

describe('JS_STRING', function () {

  // removes 'g' to avoid setting lastIndex in each iteration
  var STR = RegExp(_R.JS_STRING.source)

  it('must skip escaped EOLs in Unix, Mac, or Windows style', function () {
    var ss = [
      '"foo\\\nbar"',
      '"foo\\\rbar"',
      '"foo\\\r\nbar"',
      '"foo\\\n\\\nbar"',
      "'\\\nbar'",
      "'foo\\\n'"
    ]
    ss.forEach(function (s) { expect(s).toMatch(STR) })
  })

  it('must skip nested escaped quotes', function () {
    var ss = [
      '"foo\\"bar"', '"a\\"\\"b"', '"\\""',
      "'foo\\'bar'", "'a\\'\\'b'", "'\\''"
    ]
    ss.forEach(function (s) {
      expect(s).toMatch(STR)
      expect(s.match(STR)[0]).toMatch(s)
    })
  })
})

describe('JS_REGEX_P', function () {

  var RE = RegExp(_R.JS_REGEX_P.source)

  it('must skip JavaScript comments', function () {
    var ss = [
      '// This is a comment',
      '( /* and this */);',
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
