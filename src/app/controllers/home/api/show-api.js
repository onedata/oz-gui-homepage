import Ember from 'ember';

export default Ember.Controller.extend({
  component: Ember.computed.alias('model.component'),
  version: Ember.computed.alias('model.version')
});
