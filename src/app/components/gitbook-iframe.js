import Ember from 'ember';

import GitbookUrl from 'oz-worker-gui/utils/gitbook-url';

// FIXME back button in browser support

import {
  isAbsoluteUrl,
  absolutePath,
  absoluteUrl,
  serializePathWithHash,
  stripHash
} from 'oz-worker-gui/utils/urls';

const gitbookUrl = new GitbookUrl(
  window.location.origin,
  '/docs',
  '/#/home/documentation'
);

const {
  Component,
  assert,
  observer
} = Ember;

/**
 * A CSS selector for anchors that shouldn't be modified by ``convertGitbookLinks``.
 * @type {String}
 */
const IGNORE_ANCHOR_SELECTOR = '.js-toolbar-action';

export default Component.extend({
  tagName: 'iframe',
  classNames: ['documentation-iframe'],
  attributeBindings: ['src'],

  // FIXME: do not change src if already changed inside iframe

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
    assert(
      'component:gitbook-iframe: startSrc should not be null',
      startGitbookPath
    );
    this.set('src', gitbookUrl.gitbookPathToSrc(startGitbookPath));
  },

  init() {
    this._super(...arguments);
        
    this.startGitbookPathChanged();
  },

  aboveElementSelector: '.container-home',

  // FIXME on page doc/using_onedata/privilege_management.html#something link to privilege_management.html doesn't change location

  linkClicked(event) {
    let anchor = event.currentTarget;
    event.preventDefault();
    event.stopImmediatePropagation();
    let iframe = this.$()[0];

    let origHref = anchor.getAttribute('orig-href');

    // FIXME X proper handle of absolute urls - prevent changing iframe location
    if (isAbsoluteUrl(origHref)) {
      window.location = origHref;
    } else {
      let startGitbookPath = this.get('startGitbookPath');
      let hrefAbsolutePath = absolutePath(startGitbookPath, origHref);

      if (hrefAbsolutePath.startsWith('/')) {
        hrefAbsolutePath = hrefAbsolutePath.substr(1);
      }

      // FIXME check if origHref is used somewhere - if no, maybe set absolute path to every <a>
      this.set('_preventNextLocationChange', true);
      this.send(
        'gitbookPathChanged',
        hrefAbsolutePath
      );
      // let gitbookPath = stripHomepageDocumentationUrl(anchor.getAttribute('href'));
      // this.send('gitbookPathChanged', gitbookPath);

      // FIXME if absoluteUrl is used only here, check if it can use evaluated absoluteUrl
      // FIXME possible DOMException (cross-origin iframe)
      iframe.contentWindow.location = absoluteUrl(origHref, iframe.contentDocument);
    }
  },

  convertGitbookLinks() {
    // FIXME can throw accessing cross-origin frame (DOMException)
    let gitbookBody = this.$()[0].contentWindow.document.body;
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

  didInsertElement() {
    this._super(...arguments);
    
    // FIXME this should be invoked on load page event
    // this.convertGitbookLinks();
    // setInterval(() => this.convertGitbookLinks(), 3000);

    this.$().on('load', this.convertGitbookLinks.bind(this));

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
    console.debug('iframe did render');
  },

  actions: {
    gitbookPathChanged(path) {
      this.sendAction('gitbookPathChanged', path);
    }
  }
});
