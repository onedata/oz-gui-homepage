import Ember from 'ember';

/**
 * List of user accounts (authorizers) - a container for account-item compotents.
 * Contains also account-add button.
 * @module components/accounts-list
 * @author Jakub Liput
 * @copyright (C) 2016 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Ember.Component.extend({
  onezoneServer: Ember.inject.service(),

  classNames: ['accounts-list', 'accordion-content', 'sidebar-list'],

  /** List of authorizers objects for account-items, Objects with: type, email */
  authorizers: null,

  isLoading: Ember.computed.alias('authorizers.isUpdating'),

  authorizersSorting: ['type', 'email'],
  authorizersSorted: Ember.computed.sort('authorizers', 'authorizersSorting'),

  __supportedAuthorizersInitialized: false,

  loadingSupportedAuthorizers: Ember.computed('__supportedAuthorizersInitialized', function() {
    return !this.get('__supportedAuthorizersInitialized');
  }),

  noSupportedAuthorizers: Ember.computed('supportedAuthorizers.[]', function() {
    let supportedAuthorizers = this.get('supportedAuthorizers');
    return !supportedAuthorizers || supportedAuthorizers.length <= 0 ||
      supportedAuthorizers.length === 1 && supportedAuthorizers[0] === 'basicAuth';
  }),

  passwordConfigEnabled: Ember.computed('session.sessionDetails.basicAuthEnabled', function() {
    return this.get('session.sessionDetails.basicAuthEnabled') === true;
  }),

  initSupportedAuthorizers: Ember.on('init', function() {
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
