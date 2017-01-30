import Ember from 'ember';
import ModalMixin from 'ember-cli-onedata-common/mixins/components/modal';
import PromiseLoadingMixin from 'ember-cli-onedata-common/mixins/promise-loading';

/**
 * A form for joining group using group invitation token
 * @module components/modals/join-group
 * @author Jakub Liput
 * @copyright (C) 2017 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Ember.Component.extend(ModalMixin, PromiseLoadingMixin, {
  onezoneServer: Ember.inject.service(),
  i18n: Ember.inject.service(),
  store: Ember.inject.service(),

  /** @abstract */
  modalId: 'user-join-group',

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
    const sid = data.groupId;
    this.get('store').findRecord('group', sid).then(
      (group) => {
        this.setProperties({
          message: this.get('i18n').t('components.modals.joinGroup.joinSuccess', {
            groupName: group.get('name')
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
      () => this.joinFailed({message: 'cannot fetch group data'})
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

      this.get('onezoneServer').userJoinGroup(this.get('token')).then(
        (data) => this.joinSuccess(data),
        (error) => this.joinFailed(error)
      );

    },
  }


});
