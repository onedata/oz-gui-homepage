import Ember from 'ember';
import _ from 'lodash';
import safeExec from 'ember-cli-onedata-common/utils/safe-method-execution';

const {
  computed,
  inject,
  get
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
  supportedAuthorizersService: inject.service('supportedAuthorizers'),

  classNames: ['accounts-list', 'accordion-content', 'sidebar-list'],

  /**
   * @virtual
   * List of authorizers objects for account-items, Objects with: type, email
   */
  authorizers: undefined,

  isLoading: computed.alias('authorizers.isUpdating'),

  authorizersSorting: ['type', 'email'],
  authorizersSorted: computed.sort('authorizers', 'authorizersSorting'),

  __supportedAuthorizersInitialized: false,

  loadingSupportedAuthorizers: computed('__supportedAuthorizersInitialized', function () {
    return !this.get('__supportedAuthorizersInitialized');
  }),

  noSupportedAuthorizers: computed('supportedAuthorizers.@each.id', function () {
    let supportedAuthorizers = this.get('supportedAuthorizers');
    return !supportedAuthorizers || get(supportedAuthorizers, 'length') <= 0 ||
      supportedAuthorizers.length === 1 && get(supportedAuthorizers[0], 'id') === 'onepanel';
  }),

  passwordConfigEnabled: computed.alias('session.user.basicAuthEnabled'),

  authItems: Ember.computed(
    'authorizersSorted.[]',
    'supportedAuthorizers',
    function authItems() {
      const {
        authorizersSorted: authorizers,
        supportedAuthorizers,
      } = this.getProperties('authorizersSorted', 'supportedAuthorizers');
      if (authorizers && get(authorizers, 'length') > 0) {
        const authItems = authorizers
          .map(auth =>
            _.assign({
                email: get(auth, 'email')
              },
              _.find(supportedAuthorizers, a => a && get(a, 'id') === get(auth, 'type'))
            )
          );
        return authItems;
      } else {
        return [];
      }
    }),

  initSupportedAuthorizers() {
    this.get('supportedAuthorizersService').getSupportedAuthorizers()
      .then(({ authorizers }) => {
        safeExec(this, 'set', 'supportedAuthorizers', authorizers);
      })
      .catch(error => {
        console.error(`Cannot fetch supportedAuthorizers: ${error.message}`);
      })
      .finally(() => {
        this.set('__supportedAuthorizersInitialized', true);
      });
  },
  
  init() {
    this._super(...arguments);
    this.initSupportedAuthorizers();
  }
});
