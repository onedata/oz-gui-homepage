import Ember from 'ember';

/**
 * Helps rendering ``/home/api`` template.
 * @module controllers/home/api
 * @author Jakub Liput
 * @copyright (C) 2016 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Ember.Controller.extend({
  apiVersion: null,
  apiComponent: null,

  apiComponentName: Ember.computed('apiComponents.[]', 'apiComponent', function() {
    let {apiComponents, apiComponent} = this.getProperties('apiComponents', 'apiComponent');
    return apiComponents ? apiComponents.find(ac => ac.id === apiComponent).name : null;
  }),

  /**
   * Strip down model.components to array of id and name only
   * @type {{id: String, name: String}[]}}
   */
  apiComponents: Ember.computed('model.components.[]', function() {
    let model = this.get('model');
    return model.components.map(({id, name}) => ({id, name}));
  }),

  /**
   * @type {String[]}
   */
  apiVersions: Ember.computed('model.order.[]', function() {
    return ['latest', ...this.get('model.order')];
  }),
});
