/**
 * Adds functions to consume authentication error information (currently from cookies)
 *
 * @module mixins/authentication-error-handler
 * @author Jakub Liput
 * @copyright (C) 2017 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */

import Ember from 'ember';

const AUTHENTICATION_ERROR_REASON_KEY = 'authentication_error_reason';
const AUTHENTICATION_ERROR_STATE_KEY = 'authentication_error_state';

const {
  inject: { service },
} = Ember;

export default Ember.Mixin.create({
  cookies: service(),
  
  getAuthenticationError() {
    const cookies = this.get('cookies');
    const authenticationErrorReason = cookies.read(AUTHENTICATION_ERROR_REASON_KEY);
    const authenticationErrorState = cookies.read(AUTHENTICATION_ERROR_STATE_KEY);
    this.setProperties({
      authenticationErrorReason,
      authenticationErrorState,
    });
    cookies.clear(AUTHENTICATION_ERROR_REASON_KEY);
    cookies.clear(AUTHENTICATION_ERROR_STATE_KEY);
  },
});
