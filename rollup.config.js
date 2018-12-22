const pkg = require('./package.json')
const banner = `/**
 * perf-regexes v${pkg.version}
 * @author aMarCruz
 * @license MIT
 */
/* eslint-disable */`

export default {
  input: pkg.source,
  plugins: [],
  output: [
    {
      banner,
      file: pkg.main,
      format: 'cjs',
    },
    {
      banner,
      file: pkg.module,
      format: 'es',
    },
  ],
}
