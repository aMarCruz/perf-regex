// TODO: more tests
const expect = require('expect')
const _R = require('../')

describe('JS_STRINGS', () => {

  // removes 'g' to avoid setting lastIndex in each iteration
  let STR = RegExp(_R.JS_STRING.source)

  it('can handle escaped EOLs (Unix/Mac/Windows)', () => {
    const ss = [
      '"foo\\\nbar"',
      '"foo\\\rbar"',
      '"foo\\\r\nbar"'
    ]

    ss.forEach(s => { expect(s).toMatch(STR) })
  })

  it('can handle nested (escaped) quotes', () => {
    const ss = ['"foo\\"bar"', '"\\""',
                "'foo\\'bar'", "'\\''"]

    ss.forEach(s => {
      expect(s).toMatch(STR)
      expect(s.match(STR)[0]).toMatch(s)
    })
  })

})
