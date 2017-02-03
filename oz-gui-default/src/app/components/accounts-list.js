import Ember from 'ember';

const {
  computed,
  inject,
  on
} = Ember;

/**
 * List of user accounts (authorizers) - a container for account-item compotents.
 * Contains also account-add button.
 * @module components/accounts-list
 * @author Jakub Liput
 * @copyright (C) 2016-2017 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Ember.Component.extend({
  onezoneServer: inject.service(),

  classNames: ['accounts-list', 'accordion-content', 'sidebar-list'],

  /** List of authorizers objects for account-items, Objects with: type, email */
  authorizers: null,

  isLoading: computed.alias('authorizers.isUpdating'),

  authorizersSorting: ['type', 'email'],
  authorizersSorted: computed.sort('authorizers', 'authorizersSorting'),

  __supportedAuthorizersInitialized: false,

  loadingSupportedAuthorizers: computed('__supportedAuthorizersInitialized', function() {
    return !this.get('__supportedAuthorizersInitialized');
  }),

  noSupportedAuthorizers: computed('supportedAuthorizers.[]', function() {
    let supportedAuthorizers = this.get('supportedAuthorizers');
    return !supportedAuthorizers || supportedAuthorizers.length <= 0 ||
      supportedAuthorizers.length === 1 && supportedAuthorizers[0] === 'basicAuth';
  }),

  passwordConfigEnabled: computed.alias('session.user.basicAuthEnabled'),

  initSupportedAuthorizers: on('init', function() {
    let promise = this.get('onezoneServer').getSupportedAuthorizers();
    promise.then(data => {
      this.set('supportedAuthorizers', data.authorizers);
    });
    promise.catch(error => {
      console.error(`Cannot fetch supportedAuthorizers: ${error.message}`);
    });
    promise.finally(() => {
      this.set('__supportedAuthorizersInitialized', true);
    });
  }),
});
