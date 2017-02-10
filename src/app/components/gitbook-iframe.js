import Ember from 'ember';

import GitbookUrl from 'oz-worker-gui/utils/gitbook-url';

import {
  isAbsoluteUrl,
  absolutePath,
  absoluteUrl
} from 'oz-worker-gui/utils/urls';

// FIXME: documentation should be changed to "docs" or "documentation" should be fetched and built on runtime

const gitbookUrl = new GitbookUrl(
  window.location.origin,
  '/documentation',
  '/#/home/documentation'
);

const {
  Component,
  assert
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

  init() {
    this._super(...arguments);
    let startGitbookPath = this.get('startGitbookPath');
    assert(
      'component:gitbook-iframe: startSrc should not be null',
      startGitbookPath
    );
    this.set('src', gitbookUrl.gitbookPathToSrc(startGitbookPath));
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

      // FIXME check this code
      // FIXME check if origHref is used somewhere - if no, maybe set absolute path to every <a>
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
    let clickHandler = this.linkClicked.bind(this);
    $anchors.each(function() {
      let origHref = this.getAttribute('orig-href');
      if (!this.matches(IGNORE_ANCHOR_SELECTOR) && !origHref) {
        let href = this.getAttribute('href');
        this.setAttribute('orig-href', href);
        this.setAttribute('href', gitbookUrl.homepageHref(href, startGitbookPath));
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
