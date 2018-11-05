import Ember from 'ember';
import PageBase from './_page-base';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

let LoginRoute = PageBase.extend(UnauthenticatedRouteMixin);

/**
 * A login page, only true "home subpage" in standard OZ GUI. Show login widgets.
 * @module routes/home/login
 * @author Jakub Liput, Michal Borzecki
 * @copyright (C) 2016-2018 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default LoginRoute.extend({
  session: Ember.inject.service('session'),
  messageBox: Ember.inject.service(),
  onezoneServer: Ember.inject.service('onezoneServer'),
  
  name: 'login',
  zoneName: null,

  /**
   * If true, route will redirect to main page if user is authenticated
   * @type {boolean}
   */
  redirectIfAuthenticated: true,

  beforeModel() {
    if (this.get('session.isAuthenticated') &&
      this.get('redirectIfAuthenticated')) {
      this.transitionTo('onezone');
    }
  },

  model() {
    return new Ember.RSVP.Promise((resolve/*, reject*/) => {
      try {
        this.get('onezoneServer').getZoneName().then(
          (data) => {
            resolve({
              zoneName: data.zoneName,
              serviceVersion: data.serviceVersion,
              brandSubtitle: data.brandSubtitle,
              loginNotification: data.loginNotification,
            });
          },
          (error) => {
            console.error('Failed to get zone name and version: ' + error.message);
            resolve({
              zoneName: null,
              serviceVersion: null,
              brandSubtitle: null,
              loginNotification: null,
            });
          }
        );
      } catch (error) {
        console.error('Failed to get zone name and version because of exception: ' + error);
        resolve({
          zoneName: null,
          serviceVersion: null,
          brandSubtitle: null,
          loginNotification: null,
        });
      }
    });
  },
  
  setupController(controller) {
    this._super(...arguments);
    controller.getAuthenticationError();
  },
});
