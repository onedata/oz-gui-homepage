import Ember from 'ember';
import PageBase from './_page-base';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

let LoginRoute = PageBase.extend(UnauthenticatedRouteMixin);

/**
 * A login page, only true "home subpage" in standard OZ GUI. Show login widgets.
 * @module routes/home/login
 * @author Jakub Liput
 * @copyright (C) 2016 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default LoginRoute.extend({
  session: Ember.inject.service('session'),
  messageBox: Ember.inject.service(),
  onezoneServer: Ember.inject.service('onezoneServer'),
  name: 'login',
  zoneName: null,

  beforeModel() {
    if (this.get('session.isAuthenticated')) {
      this.transitionTo('onezone');
    }
  },

  model() {
    return new Ember.RSVP.Promise((resolve/*, reject*/) => {
      try {
        this.get('onezoneServer').getZoneName().then(
          (data) => {
            resolve({
              zoneName: data.zoneName
            });
          },
          (error) => {
            console.error('Failed to get zone name: ' + error.message);
            resolve({
              zoneName: null,
            });
          }
        );
      } catch (error) {
        console.error('Failed to get zone name because of exception: ' + error);
        resolve({
          zoneName: null,
        });
      }
    });
  },
});
