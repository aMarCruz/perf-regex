'use strict'

const expect = './node_modules/expect/umd/expect.min.js'
const tested = './index.min.js'

module.exports = function (config) {
  config.set({

    basePath: '..',

    frameworks: ['mocha'],

    files: [
      { pattern: expect, included: true, served: true, watched: false },
      { pattern: tested, included: true, served: true, watched: false },
      'test/test.js',
    ],

    reporters: ['progress'],

    browsers: ['Firefox', 'Chrome'],

    port: 9876,
    colors: true,
    autoWatch: true,
    singleRun: true,
    browserDisconnectTimeout: 2000,
    browserNoActivityTimeout: 3000,
  })
}
