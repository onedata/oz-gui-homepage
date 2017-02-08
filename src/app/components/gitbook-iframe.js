import Ember from 'ember';

const {
  Component,
  computed
} = Ember;

const DOCUMENTATION_PREFIX = '/documentation';

function stripDocumentationPath(path) {
  return path.match(new RegExp(DOCUMENTATION_PREFIX + '/(.*)'))[1];
}

export default Component.extend({
  tagName: 'iframe',
  classNames: ['documentation-iframe'],
  attributeBindings: ['src'],

  // FIXME: static
  // src: DOCUMENTATION_PREFIX + '/index.html',

  // FIXME: do not change src if already changed inside iframe

  src: computed('gitbookPath', function() {
    let gitbookPath = this.get('gitbookPath');
    if (gitbookPath) {
      return DOCUMENTATION_PREFIX + '/' + gitbookPath;
    } else {
      return DOCUMENTATION_PREFIX + '/index.html';
    }    
  }),

  aboveElementSelector: '.container-home',

  // FIXME on page doc/using_onedata/privilege_management.html#something link to privilege_management.html doesn't change location

  iframeBodyClicked(/*event*/) {
    // FIXME
    let iframe = this.$()[0];
    console.log('new location: ' + iframe.contentWindow.location);
    let iframeLocation = iframe.contentWindow.location;
    let isLocal = window.location.origin === iframeLocation.origin;
    if (isLocal) {
      let path = stripDocumentationPath(iframeLocation.pathname) + (iframeLocation.hash || '');
      console.log('FIXME: change url part to: ' + path);
      this.send('gitbookPathChanged', path);
    } else {
      let url = iframeLocation.href;
      console.debug('component:gitbook-iframe: redirecting to external: ' + url);
      window.location = url;
    }    
  },

  didInsertElement() {
    this._super(...arguments);
    
    let self = this;

    this.$().on('load', function () {
      // FIXME on bad url, this will be not invoked (cross origin frame), so we should catch exception and set index!
      $(this.contentWindow.document.body).on('click', (event) => {
        // FIXME: should poll url to change after click
        setTimeout(() => self.iframeBodyClicked(event), 0);
      });
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

  actions: {
    gitbookPathChanged(path) {
      this.sendAction('gitbookPathChanged', path);
    }
  }
});