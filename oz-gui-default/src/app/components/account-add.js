import Ember from 'ember';
import PromiseLoadingMixin from 'ember-cli-onedata-common/mixins/promise-loading';
import bindFloater from 'ember-cli-onedata-common/utils/bind-floater';
import handleLoginEndpoint from 'oz-worker-gui/utils/handle-login-endpoint';

const {
  computed,
  get,
} = Ember;

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

  isLoading: false,

  shownAuthorizers: computed('supportedAuthorizers', function shownAuthorizers() {
    return this.get('supportedAuthorizers').filter(a => get(a, 'id') !== 'onepanel');
  }),
  
  didInsertElement() {
    let popup = this.$().find('.account-add-popup');
    let updater = bindFloater(popup, undefined, {
      posY: 'middle',
    });
    this.$().on('mouseover', updater);
    $('.accordion-container').on('scroll', updater);
  },

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
