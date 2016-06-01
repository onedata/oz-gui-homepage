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
    let authProviders = [];
    let allAuthProviders = {
      google: 'Google+',
      facebook: 'Facebook',
      github: 'GitHub',
      dropbox: 'Dropbox',
      plgrid: 'PLGrid OpenID'
    };

    this.promiseLoading(
      this.get('onezoneServer').getSupportedAuthorizers()
    ).then((data) => {
      data.authorizers.forEach((authorizerId) => {
        authProviders.push([authorizerId, allAuthProviders[authorizerId]]);
      });
      authProviders = authProviders.map((item) => {
        return {
          type: item[0],
          // TODO: translate connect by
          label: `Connect by ${item[1]}`
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
          window.alert(`Error getting url to authorizer: ${error.message}`);
        }
      );
    }
  }
});
