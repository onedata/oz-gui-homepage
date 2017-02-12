/* global DOMException */
import Ember from 'ember';

import GitbookUrl from 'oz-worker-gui/utils/gitbook-url';

import {
  isAbsoluteUrl,
  absolutePath,
  absoluteUrl,
  serializePathWithHash,
  stripHash
} from 'oz-worker-gui/utils/urls';

const DOCUMENTATION_PREFIX = '/docs';
const DOCUMENTATION_INDEX = DOCUMENTATION_PREFIX + '/index.html';

const gitbookUrl = new GitbookUrl(
  window.location.origin,
  DOCUMENTATION_PREFIX,
  '/#/home/documentation'
);

const {
  Component,
  observer
} = Ember;

/**
 * A CSS selector for anchors that shouldn't be modified by ``convertGitbookLinks``.
 * @type {String}
 */
const IGNORE_ANCHOR_SELECTOR = '.js-toolbar-action';

function isGitbookDocument(doc) {
  return !!doc.querySelector('body > .book');
}

function isDOMSecurityError(error) {
  return error instanceof DOMException &&
    error.code === DOMException.SECURITY_ERR;
}

export default Component.extend({
  tagName: 'iframe',
  classNames: ['documentation-iframe'],
  attributeBindings: ['src'],

  startGitbookPath: null,
  _preventNextLocationChange: false,

  startGitbookPathChanged: observer('startGitbookPath', function() {
    let _preventNextLocationChange = this.get('_preventNextLocationChange');
    if (_preventNextLocationChange) {
      this.set('_preventNextLocationChange', false);
    } else {
      this.updateIframeSrc();
    }
    console.log('startGitbookPath: ' + this.get('startGitbookPath'));
  }),

  updateIframeSrc() {
    let startGitbookPath = this.get('startGitbookPath');
    console.warn('component:gitbook-iframe: startSrc is null, that means that probably iframe tried to open invalid page');
    this.set('src', gitbookUrl.gitbookPathToSrc(startGitbookPath));
  },

  init() {
    this._super(...arguments);
        
    this.startGitbookPathChanged();
  },

  aboveElementSelector: '.container-home',

  linkClicked(event) {
    let anchor = event.currentTarget;
    event.preventDefault();
    event.stopImmediatePropagation();
    let iframe = this.$()[0];

    let origHref = anchor.getAttribute('orig-href');

    if (isAbsoluteUrl(origHref)) {
      window.location = origHref;
    } else {
      let startGitbookPath = this.get('startGitbookPath');
      let hrefAbsolutePath = absolutePath(startGitbookPath, origHref);

      if (hrefAbsolutePath.startsWith('/')) {
        hrefAbsolutePath = hrefAbsolutePath.substr(1);
      }

      this.set('_preventNextLocationChange', true);
      this.send(
        'gitbookPathChanged',
        hrefAbsolutePath
      );
      iframe.contentWindow.location = absoluteUrl(origHref, iframe.contentDocument);
    }
  },

  convertGitbookLinks() {
    let gitbookBody = this.element.contentWindow.document.body;
    let $anchors = $(gitbookBody).find('a');
    let startGitbookPath = this.get('startGitbookPath');
    startGitbookPath = stripHash(startGitbookPath);
    let clickHandler = this.linkClicked.bind(this);
    $anchors.each(function() {
      let origHref = this.getAttribute('orig-href');
      if (!this.matches(IGNORE_ANCHOR_SELECTOR) && !origHref) {
        let href = this.getAttribute('href');
        this.setAttribute('orig-href', href);
        this.setAttribute('href', serializePathWithHash(gitbookUrl.homepageHref(href, startGitbookPath)));
        this.addEventListener('click', clickHandler);
      }
    });
  },

  /**
   * Check if ``doc`` is a valid Gitbook document.
   * If it is, return true.
   * Otherwise invoke proper action and write console error and return false. 
   * @param {HTMLDocument} doc
   * @return {Boolean} result of validation: true if document is valid
   */
  validateGitbookDocument(doc) {
    if (doc == null) {
      console.error('component:gitbook-iframe: document of Gitbook iframe is null');
      this.send('invalidPageOpened');
      return false;
    } else if (!isGitbookDocument(doc)) {
      if (doc.location.pathname === DOCUMENTATION_INDEX) {
        console.error('component:gitbook-iframe: loaded index document is not valid Gitbook document');
        return false;
      } else {
        console.error('component:gitbook-iframe: a document was not recognized as a valid Gitbook document');
        this.send('invalidPageOpened');
        return false;
      }
    } else {
      return true;
    }
  },

  /**
   * Handler of main iframe ``load`` event.
   * Checks if the loaded document is valid and if it is -
   * invoke optional notify and post-processing.
   * @param {HTMLIframeElement} iframe
   */
  onIframeLoad(iframe) {
    try {
      let iframeDocument = iframe.contentWindow.document;
      if (this.validateGitbookDocument(iframeDocument)) {
        let currentIframeGitbookPath =
          gitbookUrl.stripDocumentationUrl(iframeDocument.location.href);
        if (currentIframeGitbookPath !== this.get('startGitbookPath')) {
          this.send(
            'gitbookPathChanged',
            currentIframeGitbookPath
          );
        }
        this.convertGitbookLinks();
      }
    } catch (error) {
      if (isDOMSecurityError(error)) {
        console.error('component:gitbook-iframe: security error on loading Gitbook document');
        this.send('invalidPageOpened');
      } else {
        throw error;
      }
    }
  },

  didInsertElement() {
    this._super(...arguments);
    let self = this;

    this.element.addEventListener('load', function() {
      self.onIframeLoad(this);
    });

    // FIXME same as redoc-iframe - common!
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

  didRender() {
    // FIXME debug to remove
    console.debug('iframe did render');
  },

  actions: {
    gitbookPathChanged(path) {
      this.set('_preventNextLocationChange', true);
      this.sendAction('gitbookPathChanged', path);
    },
    invalidPageOpened() {
      // FIXME force reset to index does not work when internal frame changes location to invalid
      this.set('startGitbookPath', null);
      this.sendAction('invalidPageOpened');
    }
  }
});
