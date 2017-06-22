/**
 * Common component logic for support space modal tabs
 * @module components/modals/add-space-storage/-tab-base
 * @author Jakub Liput
 * @copyright (C) 2017 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */

import Ember from 'ember';

import generateShellCommand from 'oz-worker-gui/utils/generate-shell-command';

const {
  computed,
  RSVP: { Promise },
} = Ember;

const ObjectPromiseProxy = Ember.ObjectProxy.extend(Ember.PromiseProxyMixin);

export default Ember.Component.extend({
  /**
   * To implement in subclasses.
   * Type of command to generate
   * @abstract
   * @type {string} one of: oneprovider, onedatify
   */
  commandType: null,
  
  _clipboardTarget: computed(function() {
    return `#${this.get('elementId')} .token-input`;
  }),
  
  commandProxy: computed('commandType', 'tokenProxy.promise', function () {
    let tokenPromise = this.get('tokenProxy.promise');
    let commandType = this.get('commandType');
    if (commandType && tokenPromise) {
      let promise = new Promise((resolve, reject) => {
        tokenPromise.then(token =>
          resolve(generateShellCommand(commandType, { token }))
        );
        tokenPromise.catch(reject);
      });
      return ObjectPromiseProxy.create({ promise });
    } else {
      return undefined;
    }
  }),
    
  actions: {
    copySuccess() {
      return this.get('copySuccess')(...arguments);
    },
    copyError() {
      return this.get('copyError')(...arguments);
    },
  },
});
