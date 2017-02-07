import Ember from 'ember';

const {
  Component,
  observer
} = Ember;

const DOCUMENTATION_PREFIX = '/documentation';

export default Component.extend({
  tagName: 'iframe',
  classNames: ['documentation-iframe'],
  attributeBindings: ['src'],

  src: DOCUMENTATION_PREFIX + '/index.html',

  de: observer('src', function() {
    console.log('FIXME: src changed to: ' + this.get('src'));
  }),

  didInsertElement() {
    this._super(...arguments);
  }
});