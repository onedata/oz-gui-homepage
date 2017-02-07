import Ember from 'ember';

const {
  Component,
  computed
} = Ember;

const DOCUMENTATION_PREFIX = '/documentation';

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

  onLoad(iframe/*, event*/) {
    // FIXME
    console.log('new location: ' + iframe.contentWindow.location);
    let iframeLocation = iframe.contentWindow.location;
    let isLocal = window.location.origin === iframeLocation.origin;
    if (isLocal) {
      let path = iframeLocation.path;
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

    this.$().on('load', function(event) {
      self.onLoad(this, event);
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