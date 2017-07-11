import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

/**
 * Main entry to onezone application - load neccessary data for application.
 * @module routes/onezone
 * @author Jakub Liput
 * @copyright (C) 2016-2017 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Ember.Route.extend(AuthenticatedRouteMixin, {
  session: Ember.inject.service('session'),

  user: Ember.computed.alias('session.user'),

  model() {
    return this.get('user');
  },

  setupController(controller) {
    this._super(...arguments);
    controller.getAuthenticationError();
  },

  actions: {
    openModal() {
      this.get('controller').actions['openModal'](...arguments);
    }
  }
});
