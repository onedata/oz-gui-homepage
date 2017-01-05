import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const {
  RSVP: {
    Promise
  }
} = Ember;

/**
 * Main entry to onezone application - load neccessary data for application.
 * @module routes/onezone
 * @author Jakub Liput
 * @copyright (C) 2016 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Ember.Route.extend(AuthenticatedRouteMixin, {
  session: Ember.inject.service('session'),

  user: Ember.computed.alias('session.user'),

  model() {
    let user = this.get('user');
    return new Ember.RSVP.Promise((resolve, reject) => {
      let promises = [
        user.get('providers'),
        user.get('spaces'),
        new Promise(resolve => resolve(user.get('authorizers'))),
        user.get('clienttokens')
      ];
      Ember.RSVP.Promise.all(promises).then(
        (values) => {
          resolve({
            providers: values[0],
            spaces: values[1],
            authorizers: values[2],
            clienttokens: values[3]
          });
        },
        () => {
          reject();
        });
    });
  },

  actions: {
    openModal() {
      this.get('controller').actions['openModal'](...arguments);
    }
  }
});
