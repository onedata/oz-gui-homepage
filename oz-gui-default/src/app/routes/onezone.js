import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

/**
 * Main entry to onezone application - load neccessary data for application.
 * @module routes/onezone
 * @author Jakub Liput
 * @copyright (C) 2016 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model() {
    const promises = [
      this.store.findAll('provider'),
      this.store.findAll('space'),
      this.store.findAll('authorizer'),
      this.store.findAll('clienttoken')
    ];
    return new Ember.RSVP.Promise((resolve, reject) => {
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
