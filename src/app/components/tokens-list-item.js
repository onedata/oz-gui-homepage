import Ember from 'ember';
import safeElementId from '../utils/safe-element-id';

/**
 * A token entry in tokens-list.
 * @module components/tokens-list-item
 * @author Jakub Liput
 * @copyright (C) 2016 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Ember.Component.extend({
  store: Ember.inject.service(),
  onezoneServer: Ember.inject.service(),
  notify: Ember.inject.service(),

  /** Should be injected */
  token: null,

  classNames: ['tokens-list-item'],

  isLoading: function() {
    return !this.get('token') || !this.get('token.isLoaded') || !this.get('token.id');
  }.property('token', 'token.isLoaded'),

  clipboardTarget: Ember.computed('elementId', 'inputContainerId', function() {
    let {elementId, inputContainerId} = this.getProperties('elementId', 'inputContainerId');
    return `#${elementId} #${inputContainerId} input[type=text]`;
  }),

  inputContainerId: Ember.computed('token', 'token.id', function() {
    if (this.get('token.id')) {
      return safeElementId(`clienttoken-input-${this.get('token.id')}`);
    } else {
      return null;
    }
  }),

  selectTokenText() {
    let input = this.$().find('input')[0];
    input.setSelectionRange(0, input.value.length);
  },

  actions: {
    remove() {
      this.get('token').destroyRecord();
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
