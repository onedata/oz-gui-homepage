import Ember from 'ember';

/**
 * FIXME: jsdoc
 * @module controllers/home/api
 * @author Jakub Liput
 * @copyright (C) 2016 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Ember.Controller.extend({
  apiVersion: null,
  apiComponent: null,

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
    return this.get('model.order');
  }),
});
