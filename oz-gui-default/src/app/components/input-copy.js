/**
 * A readonly input with copy to clipboard button
 * 
 * @module components/input-copy
 * @author Jakub Liput
 * @copyright (C) 2018 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */

import Ember from 'ember';

export default Ember.Component.extend({
  notify: Ember.inject.service(),
  i18n: Ember.inject.service(),

  classNames: ['input-copy', 'input-with-button'],

  /// Options
  autofocus: true,

  clipboardTarget: Ember.computed('elementId', function() {
    return `#${this.get('elementId')} input[type=text]`;
  }),

  actions: {
    copySuccess() {
      this.get('notify').info(this.get('i18n').t('common.notify.clipboardSuccess'));
    },
    copyError() {
      this.get('notify').warn(this.get('i18n').t('common.notify.clipboardFailure'));
    },
  }
});
