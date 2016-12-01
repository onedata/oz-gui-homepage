import Ember from 'ember';

// FIXME: use https://github.com/davidjbradshaw/iframe-resizer
// FIXME: use https://github.com/jugglinmike/srcdoc-polyfill for IE/Edge
export default Ember.Component.extend({
  tagName: 'iframe',
  attributeBindings: ['srcdoc'],
  classNames: ['redoc-iframe'],

  /**
   * To inject.
   * Onedata component version string.
   * Eg. "3.0.0-rc11"
   * @type {String}
   * @required
   */
  version: null,

  /**
   * To inject.
   * Onedata component id.
   * Examples: onezone, oneprovider, onepanel, luma
   * @type {String}
   * @required
   */
  component: null,

  swaggerJsonPath: Ember.computed('version', 'component', function() {
    let {version, component} = this.getProperties('version', 'component');
    return `/swagger/${version}/${component}/swagger.json`;
  }),

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

  didInsertElement() {
    let $navbar = $('.navbar-onedata');
    let $container = this.$().parent();
    $container.css({
      position: 'fixed',
      left: 0,
      right: 0,
      bottom: 0
    });
    let __resizeFun = () => {
      $container.css('top', ($navbar.height() + 3) + 'px');
    };
    $(window).on('resize.redocIframe', __resizeFun);
    __resizeFun();
  },

  willRemoveElement() {
    $(window).off('.redocIframe');
  }
});
