import Ember from 'ember';
import PromiseLoadingMixin from 'ember-cli-onedata-common/mixins/promise-loading';
import bindFloater from 'ember-cli-onedata-common/utils/bind-floater';
import authorizers from 'oz-worker-gui/utils/authorizers';
import _ from 'lodash';
import handleLoginEndpoint from 'oz-worker-gui/utils/handle-login-endpoint';

/**
 * An add account button, which shows popup with authorization providers.
 * @module components/account-add
 * @author Jakub Liput
 * @copyright (C) 2016-2017 ACK CYFRONET AGH
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

  // TODO: handle unknown authorizers  
  authProviders: Ember.computed('supportedAuthorizers.[]', function () {
    let supportedAuthorizers = this.get('supportedAuthorizers');
    if (supportedAuthorizers && supportedAuthorizers.length > 0) {
      const authProviders = supportedAuthorizers
        .filter(id => id !== 'basicAuth')
        .map((id) => _.find(authorizers, a => a && a.type === id));
      return authProviders;
    } else {
      return [];
    }
  }),

  authEndpointError(error) {
    this.get('messageBox').open({
      title: this.get('i18n').t('common.serverError'),
      message: this.get('i18n').t('components.accountAdd.errorGettingUrl') +
        (error.message ? ': ' + error.message : ''),
      type: 'warning'
    });
  },
  
  actions: {
    connectNewAccount(providerName) {
      this.promiseLoading(
        this.get('onezoneServer').getConnectAccountEndpoint(providerName)
      ).then(
        (data) => {
          handleLoginEndpoint(data, () => {
            this.authEndpointError({
              message: this.get('i18n').t('login.endpointError')
            });
          });
        },
        (error) => {
          this.authEndpointError(error);
        }
      );
    }
  }
});
