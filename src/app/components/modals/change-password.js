import Ember from 'ember';
import PromiseLoadingMixin from 'ember-cli-onedata-common/mixins/promise-loading';
import ModalMixin from 'ember-cli-onedata-common/mixins/components/modal';

/**
 * A modal for chaning user password.
 * @module components/modals/change-password
 * @author Jakub Liput
 * @copyright (C) 2016 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Ember.Component.extend(ModalMixin, PromiseLoadingMixin, {
  onezoneServer: Ember.inject.service(),

  classNames: ['modals-change-password'],

  /** @implements ModalMixin */
  i18nPrefixKey: 'components.modals.changePassword',

  /** @abstract */
  modalId: null,

  open: false,
  isLoading: false,

  oldPasswordText: null,
  newPasswordText: null,
  retypeNewPasswordText: null,

  /** @implements ModalMixin */
  message: null,

  /**
   * @implements ModalMixin
   */
  messageType: null,

  init() {
    this._super(...arguments);
    this.setProperties({
      open: false
    });
  },

  isSubmitEnabled: function() {
    return !this.get('isLoading') &&
      this.get('oldPasswordText') && this.get('newPasswordText') &&
      this.get('retypeNewPasswordText');
  }.property('isLoading', 'oldPasswordText', 'newPasswordText', 'retypeNewPasswordText'),

  actions: {
    open() {
      this.setProperties({
        oldPasswordText: null,
        newPasswordText: null,
        retypeNewPasswordText: null,
        message: null,
        messageType: null,
      });
    },

    submit() {
      const oldPassword = this.get('oldPasswordText');
      const newPassword = this.get('newPasswordText');
      const retypeNewPassword = this.get('retypeNewPasswordText');

      if (newPassword !== retypeNewPassword) {
        this.setProperties({
          isLoading: false,
          message: this.get('i18n').t('components.modals.changePassword.passwordMatchError'),
          messageType: 'danger'
        });
        return;
      }

      this.setProperties({
        isLoading: true,
        message: null,
        messageType: null
      });


      this.promiseLoading(
        this.get('onezoneServer').changePassword(oldPassword, newPassword)
      ).then(
        () => {
          this.setProperties({
            messageType: 'success'
          });
          setTimeout(() => {
            this.set('open', false);
          }, 800);
        },
        (error) => {
          this.setProperties({
            messageType: 'danger',
            message: error.message
          });
        }
      );
    },
  }


});
