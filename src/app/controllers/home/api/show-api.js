import Ember from 'ember';

export default Ember.Controller.extend({
  apiController: Ember.inject.controller('home.api'),

  apiComponent: Ember.computed.alias('model.apiComponent'),
  apiVersion: Ember.computed.alias('model.apiVersion'),

  apiComponentOrVersionUpdated: Ember.observer('apiComponent', 'apiVersion', function() {
    let {apiComponent, apiVersion} = this.getProperties('apiComponent', 'apiVersion');
    this.get('apiController').setProperties({apiComponent, apiVersion});
  }),
});
