import Ember from 'ember';

/**
 * FIXME: jsdoc
 * @module routes/home/api/component
 * @author Jakub Liput
 * @copyright (C) 2016 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Ember.Route.extend({
  model(params) {
    this.controllerFor('home.api').set('component', params.component_id);
  }
});
