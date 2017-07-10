/**
 * Adds functions to consume authentication error information (currently from cookies)
 *
 * @module mixins/authentication-error-handler
 * @author Jakub Liput
 * @copyright (C) 2017 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */

import Ember from 'ember';

const AUTHENTICATION_ERROR_KEY = 'authentication_error';

const {
  inject: { service },
} = Ember;

export default Ember.Mixin.create({
  cookies: service(),
  
  getAuthenticationError() {
    let cookies = this.get('cookies');
    let authenticationError = cookies.read(AUTHENTICATION_ERROR_KEY);
    this.set('authenticationError', authenticationError);
    cookies.clear(AUTHENTICATION_ERROR_KEY);
  },
});
