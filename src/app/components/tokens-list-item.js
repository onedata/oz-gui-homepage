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

  /**
   * Public, to inject and to change.
   * @type {Boolean}
   */
  active: false,

  classNames: ['tokens-list-item'],

  fullToken: Ember.computed.readOnly('token.id'),

  shortToken: Ember.computed('fullToken', function() {
    let fullToken = this.get('fullToken');
    return fullToken.slice(0, 3) + "..." + fullToken.slice(fullToken.length-14, fullToken.length);
  }),

  isLoading: Ember.computed('token', 'token.isLoaded', function() {
    return !this.get('token') || !this.get('token.isLoaded') || !this.get('token.id');
  }),

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

  deactivate() {
    this.set('active', false);
  },

  didInsertElement() {
    let __deactivateFun = this.set('__deactivateFun', () => this.set('active', false));
    this.$().find('input').on('blur.tokensListItem', __deactivateFun);
  },

  willDestroyElement() {
    this.$().find('input').off('.tokensListItem');
  },

  selectTokenText() {
    let input = this.$().find('input')[0];
    input.focus();
    input.setSelectionRange(0, input.value.length);
  },

  actions: {
    activate() {
      if (!this.get('active')) {
        this.sendAction('deactivateAllTokens');
        this.set('active', true);
      }
      Ember.run.scheduleOnce('afterRender', this.selectTokenText.bind(this));
    },

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
