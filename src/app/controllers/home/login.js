import Ember from 'ember';

const {
  inject: { service },
} = Ember;

const AUTHENTICATION_ERROR_KEY = 'authentication_error';

export default Ember.Controller.extend({
  cookies: service(),
  
  getAuthenticationError() {
    let cookies = this.get('cookies');
    let authenticationError = cookies.read(AUTHENTICATION_ERROR_KEY);
    this.set('authenticationError', authenticationError);
    cookies.clear(AUTHENTICATION_ERROR_KEY);
  },
});
