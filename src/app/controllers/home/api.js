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
    let versions = this.get('model');
    return versions.components.map(({id, name}) => ({id, name}));
  }),
});
