/**
 * Adds a translated ``authenticationErrorText`` base on authentication error code
 *
 * @module mixins/authentication-error-message
 * @author Jakub Liput
 * @copyright (C) 2017 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */

import Ember from 'ember';
import _ from 'lodash';

/**
 * List of known authentication errors
 */
const AUTHENTICATION_ERRORS = [
  'server_error',
  'invalid_state',
  'invalid_request',
  'account_already_linked_to_another_user',
  'account_already_linked_to_current_user',
  'access_token_invalid',
];

const {
  computed
} = Ember;

export default Ember.Mixin.create({
  /**
   * One of AUTHENTICATION_ERRORS
   * @type {string}
   */
  authenticationError: null,
  
  authenticationErrorText: computed('authenticationError', function () {
    let authenticationError = this.get('authenticationError');
    if (authenticationError) {
      if (!_.includes(AUTHENTICATION_ERRORS, authenticationError)) {
        authenticationError = 'unknown';
      }
      return this.get('i18n')
        .t('login.authenticationError.codes.' + authenticationError);
    }
  }),
});
