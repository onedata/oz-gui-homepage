import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

/**
 * Main route of application.
 *
 * - Starts session management, see {@tutorial session}
 * @module routes/application
 * @author Jakub Liput
 * @copyright (C) 2016 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Ember.Route.extend(ApplicationRouteMixin, {
  session: Ember.inject.service('session'),
  messageBox: Ember.inject.service(),

  // please use instance-initializers/session-events to handle session events
  // activate() {
    // examples on registering additional session events handlers
    // this.get('session').on('authenticationSucceeded', () => {
    //   console.debug('authentication succeeded!');
    // });
    // this.get('session').on('invalidationSucceeded', () => {
    //   console.debug('session has been invalidated!');
    // });
  // },

  initSession: function () {
    // @todo This returns a promise. We should display a loading page here
    // and transition to proper page on promise resolve.
    this.get('session').initSession().then(
      () => {
        console.debug('initSession resolved');
      },
      // TODO: translations
      () => {
        this.get('messageBox').open({
          type: 'error',
          allowClose: false,
          title: 'Session initialization error',
          message: 'Fatal error: session cannot be initialized'
        });
      }
    );
  }.on('init')
});
