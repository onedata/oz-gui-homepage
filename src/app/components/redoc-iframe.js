import Ember from 'ember';

// FIXME: use https://github.com/davidjbradshaw/iframe-resizer
// FIXME: use https://github.com/jugglinmike/srcdoc-polyfill for IE/Edge
export default Ember.Component.extend({
  tagName: 'iframe',
  attributeBindings: ['srcdoc'],
  classNames: ['redoc-iframe'],

  // FIXME: to inject
  version: '3.0.0-rc11',
  component: 'onezone',

  // FIXME: consider management of redoc.js with npm (copy to assets on build)
  // FIXME: use redoc.min.js
  srcdoc: Ember.computed(function() {
    let {version, component} = this.getProperties('version', 'component');
    return `
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" type="text/css" href="/assets/redoc.css">
  </head>
  <body>
    <redoc spec-url="/swagger/${version}/${component}/swagger.json" hide-hostname=true></redoc>
    <script src="/assets/redoc.min.js"></script>
    <!-- <script src="/assets/iframeResizer.contentWindow.min.js"></script> -->
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
