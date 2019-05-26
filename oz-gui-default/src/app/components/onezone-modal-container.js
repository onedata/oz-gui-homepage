import Ember from 'ember';

const {
  computed,
  observer
} = Ember;

/**
 * Conditionally displays a message for user instead of providers world map.
 * @module components/onezone-modal-container
 * @author Jakub Liput
 * @copyright (C) 2016-2017 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Ember.Component.extend({
  session: Ember.inject.service('session'),

  classNames: ['onezone-modal-container'],

  /**
   * To inject.
   * @type {Provider[]}
   */
  providers: null,

  isFirstLogin: computed.alias('session.sessionDetails.firstLogin'),

  modalFirstLogin: computed('isFirstLogin', 'providers.length', function() {
    return this.get('isFirstLogin') &&
      (!this.get('providers') || this.get('providers.length') === 0);
  }),

  modalGetSupport: computed('providers.length', function() {
    return !this.get('providers') ||
      this.get('providers.length') === 0;
  }),

  /**
   * If true, show "none providers" modal
   * @type {Boolean}
   */
  modalNoneProviders: computed('providers.@each.status', function() {
    let providers = this.get('providers');
    return providers.get('length') > 0 &&
      providers.filterBy('status', 'offline').length === providers.get('length');
  }),

  init() {
    this._super(...arguments);
    this.notifyGetSupport();
  },

  notifyGetSupport: observer('modalGetSupport', function() {
    let modalGetSupport = this.get('modalGetSupport');
    if (modalGetSupport) {
      this.sendAction('needSupport');
    }
  }),

  actions: {
    goToTab(tab) {
      this.sendAction('goToTab', tab);
    }
  }

});
