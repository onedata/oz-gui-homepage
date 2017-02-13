import Ember from 'ember';
import ModalMixin from 'ember-cli-onedata-common/mixins/components/modal';
import PromiseLoadingMixin from 'ember-cli-onedata-common/mixins/promise-loading';

/**
 * A form for joining space using space invitation token
 * @module components/modals/join-space
 * @author Jakub Liput
 * @copyright (C) 2016 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Ember.Component.extend(ModalMixin, PromiseLoadingMixin, {
  onezoneServer: Ember.inject.service(),
  i18n: Ember.inject.service(),
  store: Ember.inject.service(),

  /** @abstract */
  modalId: 'user-join-space',

  open: false,

  /**
   * When true, a submit button is disabled and spinning
   */
  isWorking: false,

  /**
   * When true, input field and submit button is disabled
   */
  isDisabled: false,

  token: null,

  /**
   * @implements ModalMixin
   */
  i18nPrefixKey: null,
  messagePrefix: null,

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
    this._resetProperties();
  },

  isSubmitEnabled: Ember.computed('isWorking', 'isDisabled', 'token', function() {
    return !this.get('isWorking') && !this.get('isDisabled') && this.get('token');
  }),

  _resetProperties() {
    this.setProperties({
      token: null,
      isWorking: false,
      isDisabled: false,
      message: null,
      messageType: null
    });
  },

  joinFailed(error) {
    const msg = error.message;
    this.setProperties({
      message: this.get('i18n').t('components.modals.joinSpace.joinFailed', {
        errorDetails: msg
      }),
      messageType: 'danger',
      isWorking: false,
      isDisabled: false,
    });
  },

  joinSuccess(data) {
    const sid = data.spaceId;
    this.get('store').findRecord('space', sid).then(
      (space) => {
        this.setProperties({
          message: this.get('i18n').t('components.modals.joinSpace.joinSuccess', {
            spaceName: space.get('name')
          }),
          messageType: 'success',
        });
        this.setProperties({
          isWorking: false
        });
        setTimeout(() => {
          this.setProperties({
            open: false,
          });
          this._resetProperties();
        }, 1000);
      },
      () => this.joinFailed({message: 'cannot fetch space data'})
    );
  },

  actions: {
    open() {
      this.setProperties({
        message: null,
        messageType: null,
      });
    },

    closed() {
      if (!this.get('isWorking')) {
        this._resetProperties();
      }
    },

    submit() {
      this.setProperties({
        isWorking: true,
        isDisabled: true,
        messageType: null,
      });

      this.get('onezoneServer').userJoinSpace(this.get('token')).then(
        (data) => this.joinSuccess(data),
        (error) => this.joinFailed(error)
      );

    },
  }


});
