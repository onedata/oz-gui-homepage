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
  'bad_auth_config',
  'invalid_state',
  'invalid_auth_request',
  'idp_unreachable',
  'bad_idp_response',
  'cannot_resolve_required_attribute',
  'internal_server_error',
  'account_already_linked_to_another_user',
  'account_already_linked_to_current_user',
];

const {
  computed
} = Ember;

function stripError(authenticationError) {
  let errorCode = authenticationError;
  let errorAttribute;
  if (/^.*?:.*/.test(errorCode)) {
    [ errorCode, errorAttribute ] = errorCode.split(':');
  }
  if (!_.includes(AUTHENTICATION_ERRORS, errorCode)) {
    errorCode = 'unknown';
  }
  return [errorCode, errorAttribute];
}

export default Ember.Mixin.create({
  /**
   * One of AUTHENTICATION_ERRORS
   * @type {string}
   */
  authenticationErrorReason: undefined,
  
  authenticationErrorTitle: computed('authenticationErrorReason', function authenticationErrorTitle() {
    let authenticationErrorReason = this.get('authenticationErrorReason');
    if (authenticationErrorReason) {
      const [ errorCode ] = stripError(authenticationErrorReason);
      return this.get('i18n')
        .t(`login.authenticationError.titles.${errorCode}`);
    }
  }),
  
  authenticationErrorText: computed('authenticationErrorReason', function () {
    const authenticationErrorReason = this.get('authenticationErrorReason');    
    if (authenticationErrorReason) {
      const [ errorCode, errorAttribute ] = stripError(authenticationErrorReason);
      return this.get('i18n')
        .t(`login.authenticationError.codes.${errorCode}`, {
          attribute: errorAttribute,
        });
    }
  }),
  
  showErrorContactInfo: computed('authenticationErrorReason', function showErrorContactInfo() {
    return !_.includes(
      ['account_already_linked_to_another_user', 'account_already_linked_to_current_user'],
      this.get('authenticationErrorReason')
    );
  }),
});
