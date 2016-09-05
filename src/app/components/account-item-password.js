import Ember from 'ember';
import PromiseLoadingMixin from '../mixins/promise-loading';

/**
 * A change account password button, which shows modal with password change form.
 * @module components/account-item-password
 * @author Jakub Liput
 * @copyright (C) 2016 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Ember.Component.extend(PromiseLoadingMixin, {
  onezoneServer: Ember.inject.service('onezoneServer'),
  classNames: ['account-item'],
  classNameBindings: ['isLoading:sidebar-item-is-loading'],

  isLoading: false,
  authProviders: null,

  init() {
    this._super(...arguments);
    this.setProperties({
      modalOpened: false,
    });
  },

  click() {
    this.set('modalOpened', true);
  }
});
