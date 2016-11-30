import Ember from 'ember';

// FIXME: use https://github.com/davidjbradshaw/iframe-resizer
// FIXME: use https://github.com/jugglinmike/srcdoc-polyfill for IE/Edge
export default Ember.Component.extend({
  tagName: 'iframe',
  attributeBindings: ['srcdoc', 'onload'],
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
  </head>
  <body>
    <redoc spec-url="/swagger/${version}/${component}/swagger.json"></redoc>
    <script src="/assets/redoc.js"></script>
  </body>
</html>
`;
  }),

  onload: Ember.computed(function() {
    return `this.style.height = this.contentWindow.document.body.scrollHeight + 'px';`;
  }),
});
