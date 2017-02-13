import Ember from 'ember';

const {
  inject
} = Ember;

/**
 * Main onezone sidebar.
 * @module
 * @author Jakub Liput
 * @copyright (C) 2016-2017 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Ember.Component.extend({
  onezoneSidebar: inject.service(),

  /** Providers list should be injected */
  providers: null,
  /** Spaces list should be injected */
  spaces: null,
  /** AuthAccounts list should be injected */
  authAccounts: null,
  /** Tokens list sholud be injected (from model) */
  tokens: null,

  init() {
    this._super(...arguments);
    this.get('onezoneSidebar').set('component', this);
  },

  actions: {
    openModal() {
      this.sendAction('openModal', ...arguments);
    }
  }
});
