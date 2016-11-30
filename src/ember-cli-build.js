/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    sassOptions: {
      includePaths: ['app/styles', 'app/styles/oneicons']
    },
    'ember-bootstrap': {
      'importBootstrapFont': true,
      'importBootstrapCSS': false
    }
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  const BOWER_ASSETS = [
    'owl-carousel/owl-carousel/owl.carousel.min.js',
    'owl-carousel/owl-carousel/owl.carousel.css',
    'owl-carousel/owl-carousel/owl.theme.css',
    'owl-carousel/owl-carousel/owl.transitions.css',
    'bind-first/release/jquery.bind-first-0.2.3.min.js',
    'jquery-mousewheel/jquery.mousewheel.min.js',
    'jquery-searchable/dist/jquery.searchable-1.1.0.min.js',
    '/spin.js/spin.js'
  ];

  BOWER_ASSETS.forEach(path => app.import(app.bowerDirectory + '/' + path));

  return app.toTree();
};
