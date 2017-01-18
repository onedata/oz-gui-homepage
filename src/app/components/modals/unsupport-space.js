import Ember from 'ember';
import PromiseLoadingMixin from 'ember-cli-onedata-common/mixins/promise-loading';
import ModalMixin from 'ember-cli-onedata-common/mixins/components/modal';

/**
 * A modal for unsupport space (remove provider support from space).
 * @module components/modals/unsupport-space
 * @author Jakub Liput
 * @copyright (C) 2016 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Ember.Component.extend(ModalMixin, PromiseLoadingMixin, {
  onezoneServer: Ember.inject.service(),

  /** @implements ModalMixin */
  i18nPrefixKey: 'components.modals.unsupportSpace',

  modalId: 'unsupport-space',

  open: false,
  isLoading: false,

  /** @implements ModalMixin */
  message: null,

  /**
   * @implements ModalMixin
   */
  messageType: null,

  /**
   * To inject
   * @type Space
   */
  space: null,

  /**
   * To inject
   * @type Provider
   */
  provider: null,

  checkboxGroupValues: Ember.Object.create(),
  confirmChecked: false,

  /**
   * Indicates that user clicked "yes" and we force user to confirm his decision.
   * @type boolean
   */
  isConfirming: false,

  isSubmitEnabled: Ember.computed('isLoading', 'confirmChecked', function() {
    return !this.get('isLoading') && this.get('confirmChecked');
  }),

  actions: {
    open() {
      this.setProperties({
        confirmChecked: false,
        message: null,
        messagePrefix: null,
        messageType: null,
      });
    },

    submit() {
      // TODO This should use relationship removal rather than RPC call
      let {
        space,
        provider,
        i18n
      } = this.getProperties(
        'space',
        'provider',
        'i18n'
      );
      let unsupportSpacePromise =
        this.get('onezoneServer').unsupportSpace(space.get('id'), provider.get('id'));
      unsupportSpacePromise.then(
        () => {
          console.debug(`Space "${space.get('name')}" unsupported successfully`);
          this.setProperties({
            message: i18n.t('components.modals.unsupportSpace.unsupportSpaceSuccess', {
              spaceName: space.get('name')
            }),
            messageType: 'success'
          });
          setTimeout(() => {
            this.set('open', false);
          }, 1000);
        },
        (error) => {
          this.setProperties({
            messagePrefix: i18n.t('components.modals.unsupportSpace.unsupportSpaceFailed'),
            message: (error.message ? error.message : 'unknown error'),
            messageType: 'danger'
          });
        }
      );
      unsupportSpacePromise.finally(() => {
        this.setProperties({
         isLoading: false
        });
      });
    },
  }


});
