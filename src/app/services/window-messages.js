import Ember from 'ember';

/**
 * Handles messages posted with ``window.postMessage``,
 * @module services/window-messages
 * @author Jakub Liput
 * @copyright (C) 2016 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Ember.Service.extend({
  server: Ember.inject.service(),

  init() {
    this._super(...arguments);
    window.addEventListener('message', event => this.handleMessage(event));
    this.set('handlers', new Map());
  },

  // FIXME off window message

  onWindowMessage(type, handler) {
    let handlers = this.get('handlers');
    if (handlers[type] == null) {
      handlers[type] = [];
    }
    handlers[type].push(handler);
  },

  handleMessage(event) {
    let handlers = this.get('handlers');
    let {data, data: {type}} = event;
    let typeHandlers = handlers[type];
    if (typeHandlers) {
      typeHandlers.forEach(handler => {
        handler(data, event);
      });
    }
  }
});