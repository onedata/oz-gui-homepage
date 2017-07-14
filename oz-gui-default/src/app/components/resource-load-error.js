/**
 * A message to display in place of some resource cannot be loaded. 
 *
 * @module components/resource-load-error
 * @author Jakub Liput
 * @copyright (C) 2017 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */

import Ember from 'ember';

const {
  Component,
  computed,
} = Ember;

function getErrorDetails(reason) {
  return reason && reason.error || reason;
}

export default Component.extend({
  classNames: ['alert', 'alert-danger', 'alert-promise-error', 'resource-load-error'],

  /**
   * Action to invoke on alert panel close.
   * If not null - show a close button in alert panel.
   * @type {function|undefined}
   */
  onClose: undefined,

  /**
   * Displayed error details generated from reason error object
   * @type {string}
   */
  _reasonDetails: computed('reason', function () {
    return getErrorDetails(this.get('reason'));
  }),

  init() {
    this._super(...arguments);
    if (!this.get('message')) {
      // TODO i18n
      this.set('message', 'Sorry, but this resource didn\'t load properly.');
    }
  },

  actions: {
    toggleShowDetails() {
      this.toggleProperty('showDetails');
    },
    close() {
      this.get('onClose')();
    }
  }
});
