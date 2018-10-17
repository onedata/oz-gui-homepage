/**
 * A modal that presents authentication error after trying to add account in OZ
 * @module components/modals/authentication-error
 * @author Jakub Liput
 * @copyright (C) 2017 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */

import Ember from 'ember';
import AuthenticationErrorMessageMixin from 'oz-worker-gui/mixins/authentication-error-message';

const {
  inject: {
    service
  },
  observer,
  on,
} = Ember;

export default Ember.Component.extend(AuthenticationErrorMessageMixin, {
  i18n: service(),

  /** @abstract */
  modalId: null,

  showAuthenticationError: false,

  /**
   * To inject.
   * @type {string}
   */
  authenticationErrorReason: null,
  
  authenticationErrorState: null,

  authenticationErrorChanged: on('init', observer('authenticationErrorReason', function () {
    this.set('showAuthenticationError', !!this.get('authenticationErrorReason'));
  })),
});
