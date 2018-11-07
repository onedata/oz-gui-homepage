import Ember from 'ember';
import bindElementTop from 'oz-worker-gui/utils/bind-element-top';

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
  attributeBindings: ['src', 'onload'],
  classNames: ['redoc-iframe', 'one-iframe'],

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
   * @virtual
   * Notifies true when src in iframe is changed but it's body is not loaded yet.
   * Notifies false when the body loads.
   * @type {boolean}
   */
  iframeSrcLoadingChanged: () => {},
  
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
  
  redocDocumentPath: Ember.computed('apiVersion', 'apiComponent', function() {
    let {apiVersion, apiComponent} = this.getProperties('apiVersion', 'apiComponent');
    return `/docs/doc/swagger/${apiVersion}/${apiComponent}/redoc-static.html`;
  }),
  
  src: Ember.computed('redocDocumentPath', function src() {
    const redocDocumentPath = this.get('redocDocumentPath');
    if (redocDocumentPath) {
      Ember.run.scheduleOnce('afterRender', this, 'srcChanged');
      return redocDocumentPath;
    }
  }),
    
  /**
   * Sets `iframeLoaded` flag in iframe's document.
   * @type {function}
   */
  onload: Ember.computed(function onload() {
    return () => {
      this.get('iframeSrcLoadingChanged')(false);
      this.element.contentDocument.iframeLoaded = true;
    };
  }),
  
  anchorChanged: Ember.observer('anchor', function() {
    let anchor = this.get('anchor');
    if (anchor) {
      this.changeRedocAnchor(anchor);
    }
  }),
  
  srcChanged: Ember.observer('src', function srcChanged() {
    const src = this.get('src');
    if (src && src !== 'about:blank') {
      this.get('iframeSrcLoadingChanged')(true);
      Ember.run.next(this, 'srcLoadStarted');
    }
  }),
  
  init() {
    this._super(...arguments);
    this.srcChanged();
  },
  
  /**
   * Adds custom code to ReDoc document as soon as possible
   * 
   * - `/assets/redoc.css` - custom styles to modify ReDoc look for Onedata integration
   * - `/assets/onedata-redoc.js` - code for Onedata Homepage and ReDoc integration
   *   see this file for details
   * 
   * Also two variables are set for the iframe context:
   * - `document.apiAnchor` - if an anchor is passed in ``anchor`` property then
   *   try to jump to proper section/tag/operation in ReDoc docs
   * - `apiBaseUrl` - a URL of current location where this component is rendered
   *   e.g. https://veilfsdev.com/#/home/api/3.0.0-rc11/onezone (without query string "?query=...")
   * 
   * For more information about integration code, see `/assets/onedata-redoc.js`.
   */
  srcLoadStarted() {
    console.debug('component:redoc-iframe: srcLoadStarted check');
    const iframeDocument = this.element.contentDocument;
    if (iframeDocument && this.element.src === iframeDocument.location.href && iframeDocument.head && iframeDocument.body && iframeDocument.getElementById('redoc')) {
      const baseUrl = stripUrlFromQueryParams(window.location.href);
      iframeDocument.apiBaseUrl = escapeJsString(baseUrl);
      iframeDocument.parentOrigin = escapeJsString(window.location.origin);
      iframeDocument.apiAnchor = this.get('anchor');
      
      const onedataRedocScript = iframeDocument.createElement('script');
      onedataRedocScript.src = '/assets/onedata-redoc.js';
      iframeDocument.body.appendChild(onedataRedocScript);
      
      const onedataRedocStyle = iframeDocument.createElement('link');
      onedataRedocStyle.rel = 'stylesheet';
      onedataRedocStyle.type = 'text/css';
      onedataRedocStyle.href = '/assets/redoc.css';
      iframeDocument.head.appendChild(onedataRedocStyle);
      console.debug('component:redoc-iframe: srcLoadStarted done');
    } else {
      Ember.run.later(this, 'srcLoadStarted', 100);
    }
  },
  
  changeRedocAnchor(anchor) {
    let redocWindow = this.$()[0].contentWindow;
    redocWindow.postMessage({type: 'anchor-changed', message: anchor}, '*');
  },
  
  /**
   * Will bind to ``window.resize`` event to change top fixed position of
   * its parent. This is done because of problems with positioning content
   * below a top bar.
   */
  didInsertElement() {
    let $aboveElement = $(this.get('aboveElementSelector'));
    Ember.assert($aboveElement.length === 1, 'above element should exist');
    let $belowElement = this.$().parent();
    let updater = bindElementTop($aboveElement, $belowElement);
    $(window).on('resize.redocIframe', updater);
  },

  willDestroyElement() {
    $(window).off('.redocIframe');
  }
});
