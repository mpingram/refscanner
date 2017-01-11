// #docregion
module.exports = function(config) {

  config.set({
    basePath: 'compiled/spec',
    frameworks: ['jasmine'],
    plugins: [
      //require('jasmine-node'),
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'), // click "Debug" in browser to see it
      //require('karma-htmlfile-reporter') // crashing w/ strange socket error
    ],
    files: [
      '**/*.js'
    ],

    //files: [],
    exclude: ['node_modules'],
    preprocessors: {},
    // disabled HtmlReporter; suddenly crashing w/ strange socket error
    reporters: ['progress', 'kjhtml'],//'html'],
    // HtmlReporter configuration
    htmlReporter: {
      // Open this file to see results in browser
      outputFile: '_test-output/tests.html',
      // Optional
      pageTitle: 'Unit Tests',
      subPageTitle: __dirname
    },

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  });
};