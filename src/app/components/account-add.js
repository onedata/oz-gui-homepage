import Ember from 'ember';
import PromiseLoadingMixin from 'ember-cli-onedata-common/mixins/promise-loading';
import bindFloater from 'ember-cli-onedata-common/utils/bind-floater';

const AUTH_PROVIDERS_NAMES = {
  google: 'Google+',
  facebook: 'Facebook',
  github: 'GitHub',
  dropbox: 'Dropbox',
  plgrid: 'PLGrid OpenID',
  indigo: 'Indigo',
  egi: 'EGI',
  rhea: 'RHEA KeyCloak'
};

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
  messageBox: Ember.inject.service(),

  /**
   * To inject.
   * @required
   * @type {Array<String>}
   */
  supportedAuthorizers: null,

  isLoading: false,

  didInsertElement() {
    let popup = this.$().find('.account-add-popup');
    let updater = bindFloater(popup);
    this.$().on('mouseover', updater);
    $('.accordion-container').on('scroll', updater);
  },

  authProviders: Ember.computed('supportedAuthorizers.[]', function() {
    let supportedAuthorizers = this.get('supportedAuthorizers');
    if (supportedAuthorizers && supportedAuthorizers.length > 0) {
      // show only these providers for add, which have entry in "allAuthProviders" dict
      const authProviders = supportedAuthorizers
        .filter(id => AUTH_PROVIDERS_NAMES[id])
        .map((id) => {
          return {
            type: id,
            label: `${this.get('i18n').t('onezone.accountAdd.connectBy')} ${AUTH_PROVIDERS_NAMES[id]}`
          };
        });
      return authProviders;
    } else {
      return [];
    }
  }),

  actions: {
    connectNewAccount(providerName) {
      this.promiseLoading(
        this.get('onezoneServer').getConnectAccountEndpoint(providerName)
      ).then(
        (data) => {
          window.location = data.url;
        },
        (error) => {
          this.get('messageBox').open({
            title: this.get('i18n').t('common.serverError'),
            message: this.get('i18n').t('components.accountAdd.errorGettingUrl') +
              (error.message ? ': ' + error.message : ''),
            type: 'warning'
          });
        }
      );
    }
  }
});
