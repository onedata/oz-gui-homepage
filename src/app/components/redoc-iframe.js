import Ember from 'ember';

// from srcdoc-polyfill
/* globals srcDoc */

function stripUrlFromQueryParams(href) {
  let match = href.match(/(.*?)\?.*|.*/);
  return match[1] || match[0];
}

function escapeJsString(value) {
  return value.replace(/"/g, '\\"');
}

/**
 * An iframe for hosting ReDoc rendered API documentation.
 * It uses HTML5 ``srcdoc`` property of iframe, generating initial iframe content based on:
 * - apiVersion
 * - apiComponent
 * - anchor (optional) - a section/tag/operation to jump inside API doc
 * 
 * Using above properties, a Swagger JSON is selected, which is then injected into redoc tag.
 * See ``srcdoc`` computed property for more information.
 *  
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
   * To inject. Optional.
   * A ReDoc internal link, eg. ``#operation/modify_provider``
   * If not null, go to the specified anchor after ReDoc load.
   * @type {String}
   */
  anchor: null,

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
   * Generates an HTML for iframe with API documentation.
   * It renders redoc using redoc tag and importing redoc JS.
   *
   * The generated document has included:
   * - ``/assets/redoc.css`` - custom styles to modify ReDoc look for Onedata integration
   * - ``/assets/redoc.min.js`` - RedDoc documentation system (https://github.com/Rebilly/ReDoc)
   *   that will set up a documentation
   * - ``/assets/onedata-redoc.js`` - code for Onedata Homepage and ReDoc integration
   *   see this file for details
   * 
   * Also two variables are setted for the iframe context:
   * - ``document.apiAnchor`` - if an anchor is passed in ``anchor`` property then
   *   try to jump to proper section/tag/operation in ReDoc docs
   * - ``apiBaseUrl`` - a URL of current location where this component is rendered
   *   e.g. https://veilfsdev.com/#/home/api/3.0.0-rc11/onezone (without query string "?query=...")
   * 
   * For more information about integration code, see ``/assets/onedata-redoc.js``.
   * @type {String}
   */
  srcdoc: Ember.computed('swaggerJsonPath', 'anchor', function() {
    let {anchor, swaggerJsonPath} = this.getProperties('swaggerJsonPath', 'anchor');
    let baseUrl = stripUrlFromQueryParams(window.location.href);

    if (anchor) {
      anchor = escapeJsString(anchor);
    }
    swaggerJsonPath = escapeJsString(swaggerJsonPath);
    baseUrl = escapeJsString(baseUrl);

    return `
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" type="text/css" href="/assets/redoc.css">
  </head>
  <body>
    <redoc spec-url="${swaggerJsonPath}" hide-hostname=true></redoc>
    <script src="/assets/redoc.min.js"></script>
    <script>
      document.apiAnchor = ${anchor ? `"#${anchor}"` : 'null'};
      document.apiBaseUrl = "${baseUrl}";
    </script>
    <script src="/assets/onedata-redoc.js"></script>
  </body>
</html>
`;
  }),

  /**
   * Use srcdoc-polyfill for IE/Edge support
   */
  updateSrcdocPolyfill: Ember.observer('srcdoc', function() {
    Ember.run.schedule('afterRender', this, function() {
      srcDoc.set(this.$()[0]);
    });    
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
    this.updateSrcdocPolyfill();
  },

  willRemoveElement() {
    $(window).off('.redocIframe');
  }
});
