import Ember from 'ember';
import PromiseLoadingMixin from '../mixins/promise-loading';
import bindFloater from '../utils/bind-floater';

/**
 * An add account button, which shows popup with authorization providers.
 * @module components/account-add
 * @author Jakub Liput
 * @copyright (C) 2016 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Ember.Component.extend(PromiseLoadingMixin, {
  onezoneServer: Ember.inject.service('onezoneServer'),
  classNames: ['account-add', 'account-item'],
  classNameBindings: ['isLoading:sidebar-item-is-loading'],

  isLoading: false,
  authProviders: null,

  didInsertElement() {
    let popup = this.$().find('.account-add-popup');
    let updater = bindFloater(popup);
    this.$().on('mouseover', updater);
    $('.accordion-container').on('scroll', updater);
  },

  generateAuthProviders: function () {
    const allAuthProviders = {
      google: 'Google+',
      facebook: 'Facebook',
      github: 'GitHub',
      dropbox: 'Dropbox',
      plgrid: 'PLGrid OpenID',
      indigo: 'Indigo'
    };

    this.promiseLoading(
      this.get('onezoneServer').getSupportedAuthorizers()
    ).then((data) => {
      // show only these providers for add, which have entry in "allAuthProviders" dict
      const authProviders = data.authorizers
        .filter(id => allAuthProviders[id])
        .map((id) => {
          return {
            type: id,
            label: `${this.get('i18n').t('onezone.accountAdd.connectBy')} ${allAuthProviders[id]}`
          };
        });
      this.set('authProviders', authProviders);
    });
  }.on('init'),

  actions: {
    connectNewAccount(providerName) {
      this.promiseLoading(
        this.get('onezoneServer').getConnectAccountEndpoint(providerName)
      ).then(
        (data) => {
          window.location = data.url;
        },
        (error) => {
          // TODO: do not use window.alert
          window.alert(`Error getting url to authorizer: ${error.message}`);
        }
      );
    }
  }
});
