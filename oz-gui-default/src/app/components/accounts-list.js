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
  classNames: ['accounts-list', 'accordion-content', 'sidebar-list'],

  /** List of authorizers objects for account-items, Objects with: type, email */
  authorizers: null,

  isLoading: Ember.computed.alias('authorizers.isUpdating'),

  authorizersSorting: ['type', 'email'],
  authorizersSorted: Ember.computed.sort('authorizers', 'authorizersSorting'),

  initAuth: function() {
  }.observes('authorizers')
});
