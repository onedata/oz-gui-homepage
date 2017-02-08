import Ember from 'ember';

const {
  Component,
  assert
} = Ember;

const ORIGIN = window.location.origin;
const DOCUMENTATION_PREFIX = '/documentation';
const HOMEPAGE_DOCUMENTATION_PREFIX = '/#/home/documentation';
const RE_DOCUMENTATION_URL = new RegExp(ORIGIN + DOCUMENTATION_PREFIX + '/(.*)');
const RE_HOMEPAGE_URL = new RegExp(ORIGIN + HOMEPAGE_DOCUMENTATION_PREFIX + '/(.*)');
const RE_ABSOLUTE_URL = new RegExp('^(?:[a-z]+:)?//', 'i');

function gitbookPathToSrc(gitbookPath='index.html') {
  return DOCUMENTATION_PREFIX + '/' + gitbookPath;
}

function gitbookUrl(gitbookPath) {
  return ORIGIN + gitbookPathToSrc(gitbookPath);
}

function isAbsoluteUrl(url) {
  return RE_ABSOLUTE_URL.test(url);
}

/**
 * http://stackoverflow.com/a/14780463
 */
function absolutePath(base, relative) {
  var stack = base.split("/"),
    parts = relative.split("/");
  // (omit if "base" is the current folder without trailing slash)
  stack.pop(); // remove current file name (or empty string)
  for (var i = 0; i < parts.length; i++) {
    if (parts[i] === ".") {
      continue;
    }
    if (parts[i] === "..") {
      stack.pop();
    } else {
      stack.push(parts[i]);
    }
  }
  return stack.join("/");
}


// FIXME X ignore absolute links
// FIXME X convert relative ../ and ./ in links - should use base of current iframe url
function homepageLink(originalHref, gitbookBase) {
  if (isAbsoluteUrl(originalHref)) {
    return originalHref;
  } else {
    return ORIGIN + HOMEPAGE_DOCUMENTATION_PREFIX + '/' + absolutePath(gitbookBase, originalHref);
  }
}

function stripHomepageDocumentationUrl(url) {
  return url.match(RE_HOMEPAGE_URL)[1];
}

function stripDocumentationUrl(url) {
  return url.match(RE_DOCUMENTATION_URL)[1];
}

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
    this.set('src', gitbookPathToSrc(startGitbookPath));
  },

  aboveElementSelector: '.container-home',

  // FIXME on page doc/using_onedata/privilege_management.html#something link to privilege_management.html doesn't change location

  linkClicked(event) {
    // FIXME use some data-gitbook-href to change URL inside iframe
    let anchor = event.target;
    event.preventDefault();
    event.stopImmediatePropagation();
    let iframe = this.$()[0];

    let origHref = anchor.getAttribute('orig-href');

    // FIXME X proper handle of absolute urls - prevent changing iframe location
    if (isAbsoluteUrl(origHref)) {
      window.location = origHref;
    } else {
      // FIXME
      // let gitbookPath = stripHomepageDocumentationUrl(anchor.getAttribute('href'));
      // this.send('gitbookPathChanged', gitbookPath);

      // iframe.contentWindow.location = gitbookUrl(origHref);
      // FIXME
      document.getElementsByTagName('iframe')[0].contentWindow.location = gitbookUrl(origHref);
    }    
  },

  iframeBodyClicked(event) {
    if (event.target.tagName === 'A') {
      this.linkClicked(event);
    }
  },
    // otherwise - something that is not a link was clicked
    // FIXME: check not-links (buttons?)

    // FIXME - move features to this.linkClicked
  //   let iframe = this.$()[0];
  //   console.log('new location: ' + iframe.contentWindow.location);
  //   let iframeLocation = iframe.contentWindow.location;
  //   let isLocal = window.location.origin === iframeLocation.origin;
  //   if (isLocal) {
  //     let path = stripDocumentationUrl(iframeLocation.href) + (iframeLocation.hash || '');
  //     console.log('FIXME: change url part to: ' + path);
  //     this.send('gitbookPathChanged', path);
  //   } else {
  //     let url = iframeLocation.href;
  //     console.debug('component:gitbook-iframe: redirecting to external: ' + url);
  //     window.location = url;
  //   }

  convertGitbookLinks() {
    let gitbookBody = this.$()[0].contentWindow.document.body;
    let $anchors = $(gitbookBody).find('a');
    let gitbookBase = this.get('startGitbookPath');
    $anchors.each(function() {
      let origHref = this.getAttribute('orig-href');
      if (!origHref) {
        let href = this.getAttribute('href');
        this.setAttribute('orig-href', href);
        this.setAttribute('href', homepageLink(href, gitbookBase));
      }
    });
  },

  didInsertElement() {
    this._super(...arguments);
    
    let self = this;

    this.$().on('load', function () {
      // FIXME on bad url, this will be not invoked (cross origin frame), so we should catch exception and set index!
      $(this.contentWindow.document.body).on('click', (event) => {
        setTimeout(() => self.iframeBodyClicked(event), 0);
      });
    });

    // FIXME this should be invoked on load page event
    setInterval(() => this.convertGitbookLinks(), 3000);

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