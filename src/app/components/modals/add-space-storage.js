import Ember from 'ember';
import ModalMixin from 'ember-cli-onedata-common/mixins/components/modal';
import PromiseLoadingMixin from 'ember-cli-onedata-common/mixins/promise-loading';

/**
 * A form for logging in with username and password (invoked by one of login buttons)
 * @module components/modals/add-space-storage
 * @author Jakub Liput
 * @copyright (C) 2017 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */

const ObjectPromiseProxy = Ember.ObjectProxy.extend(Ember.PromiseProxyMixin);

const {
  RSVP: { Promise },
  computed,
  inject: { service },
} = Ember;

export default Ember.Component.extend(ModalMixin, PromiseLoadingMixin, {
  onezoneServer: service(),
  
  /** @abstract */
  modalId: null,

  open: false,
  isLoading: false,

  /**
   * @implements ModalMixin
   */
  i18nPrefixKey: 'components.modals.addSpaceStorage',

  /**
   * @implements ModalMixin
   */
  message: null,

  /**
   * @implements ModalMixin
   */
  messageType: null,
  
  /**
   * To inject.
   * @type {Space}
   */
  space: null,

  supportTokenProxy: null,
  supportToken: computed.readOnly('supportTokenProxy.content'),

  init() {
    this._super(...arguments);
    this.setProperties({
      open: false
    });
  },
  
  /**
   * Sets a promise proxy object for ``supportTokenProxy``
   * and returns a promise (fetching token)
   * @returns {Promise}
   */
  _getNewSupportToken() {
    let spaceId = this.get('space.id');
    let promise = new Promise((resolve, reject) => {
      return this.get('onezoneServer').getTokenProviderSupportSpace(spaceId)
        .then(
          ({ token }) => resolve(token),
          () => reject(...arguments)
        );
    });
    this.set('supportTokenProxy', ObjectPromiseProxy.create({ promise }));
    return promise;
  },
  
  actions: {
    open() {
      this._getNewSupportToken();
    },

    /**
     * @returns {Promise}
     */
    getNewSupportToken() {
      return this._getNewSupportToken();
    },
    
    copySuccess() {
      this.selectTokenText();
      this.get('notify').info(this.get('i18n').t('common.notify.clipboardSuccess'));
    },
    
    copyError() {
      this.selectTokenText();
      this.get('notify').warn(this.get('i18n').t('common.notify.clipboardFailure'));
    },
  }


});
