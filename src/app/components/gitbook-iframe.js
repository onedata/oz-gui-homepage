import Ember from 'ember';

import GitbookUrl from 'oz-worker-gui/utils/gitbook-url';

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

  gitbookPageLoaded() {
    // FIXME can throw accessing cross-origin frame (DOMException) - handle invalid links
    let currentGitbookPath = gitbookUrl.stripDocumentationUrl(this.element.contentWindow.location.href);
    if (currentGitbookPath !== this.get('startGitbookPath')) {
      this.set('_preventNextLocationChange', true);
      this.send(
        'gitbookPathChanged',
        currentGitbookPath
      );
    }
    this.convertGitbookLinks();
  },

  didInsertElement() {
    this._super(...arguments);

    this.$().on('load', this.gitbookPageLoaded.bind(this));

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
