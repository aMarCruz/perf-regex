const uglify = require('rollup-plugin-uglify').uglify
const pkg = require('./package.json')

export default {
  input: pkg.source,
  plugins: [
    uglify(),
  ],
  output: {
    file: pkg.browser,
    format: 'umd',
    name: 'R',
    sourcemap: false,
  },
}
