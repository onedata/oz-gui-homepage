import Ember from 'ember';

// FIXME: use https://github.com/jugglinmike/srcdoc-polyfill for IE/Edge
/**
 * FIXME: jsdoc
 * @module components/redoc-iframe
 * @author Jakub Liput
 * @copyright (C) 2016 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Ember.Component.extend({
  tagName: 'iframe',
  attributeBindings: ['srcdoc'],
  classNames: ['redoc-iframe'],

  /**
   * To inject.
   * Onedata apiComponent apiVersion string.
   * Eg. "3.0.0-rc11"
   * @type {String}
   * @required
   */
  apiVersion: null,

  /**
   * To inject.
   * Onedata apiComponent id.
   * Examples: onezone, oneprovider, onepanel, luma
   * @type {String}
   * @required
   */
  apiComponent: null,

  /**
   * Optional inject.
   * A jQuery selector to find a element that will be above redoc-iframe.
   * @type {String}
   */
  aboveElementSelector: '.api-components-menu',

  /**
   * Generate HTTP resource path to Swagger JSON.
   * @type {String}
   */
  swaggerJsonPath: Ember.computed('apiVersion', 'apiComponent', function() {
    let {apiVersion, apiComponent} = this.getProperties('apiVersion', 'apiComponent');
    return `/swagger/${apiVersion}/${apiComponent}/swagger.json`;
  }),

  /**
   * Generates a HTML for iframe with API documentation.
   * It renders redoc using redoc tag and importing redoc JS.
   * @type {String}
   */
  srcdoc: Ember.computed('swaggerJsonPath', function() {
    let swaggerJsonPath = this.get('swaggerJsonPath');
    return `
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" type="text/css" href="/assets/redoc.css">
  </head>
  <body>
    <redoc spec-url="${swaggerJsonPath}" hide-hostname=true></redoc>
    <script src="/assets/redoc.min.js"></script>
  </body>
</html>
`;
  }),

  /**
   * Will bind to ``window.resize`` event to change top fixed position of
   * its parent. This is done because of problems with positioning content
   * below a top bar.
   */
  didInsertElement() {
    let $aboveElement = $(this.get('aboveElementSelector'));
    Ember.assert($aboveElement.length === 1, 'above element should exist');
    let $container = this.$().parent();
    $container.css({
      position: 'fixed',
      left: 0,
      right: 0,
      bottom: 0
    });
    let __resizeFun = () => {
      $container.css('top', ($aboveElement.offset().top + $aboveElement.height()) + 'px');
    };
    $(window).on('resize.redocIframe', __resizeFun);
    __resizeFun();
  },

  willRemoveElement() {
    $(window).off('.redocIframe');
  }
});
