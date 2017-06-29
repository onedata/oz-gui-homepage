import Ember from 'ember';
import AUTHORIZERS from 'oz-worker-gui/utils/authorizers';

const {
  computed,
} = Ember;

export default Ember.Component.extend({
  onezoneServer: Ember.inject.service(),
  messageBox: Ember.inject.service(),

  /**
   * List of authorizers
   * @type {Array.string}
   * 
   * Set by initSupportedAuthorizers
   */
  supportedAuthorizers: null,

  selectedAuthorizer: null,

  isUsernameLoginActive: false,
  
  authorizersForButtons: computed('supportedAuthorizers.[]', function () {
    let supportedAuthorizers = this.get('supportedAuthorizers');
    if (supportedAuthorizers) {
      return supportedAuthorizers.slice(0, 7);
    }
    else {
      return [];
    }
  }),

  authorizersForSelect: computed('supportedAuthorizers.[]', function () {
    let supportedAuthorizers = this.get('supportedAuthorizers');
    if (supportedAuthorizers) {
      return supportedAuthorizers.filter(auth => auth.type !== 'basicAuth');
    }
    else {
      return [];
    }
  }),

  isLoading: false,
  errorMessage: null,

  initSupportedAuthorizers: function () {
    this.set('isLoading', true);
    const p = this.get('onezoneServer').getSupportedAuthorizers();
    p.then((data) => {
      let predefinedAuthorizersList = AUTHORIZERS.map(auth => auth.type);
      let authorizers = [];
      predefinedAuthorizersList.forEach((auth, index) => {
        if (data.authorizers.indexOf(auth) > -1) {
          authorizers.push(AUTHORIZERS[index]);
        }
      });
      data.authorizers.forEach((auth) => {
        if (predefinedAuthorizersList.indexOf(auth) === -1) {
          // default configuration for unknown authorizer
          authorizers.push({
            type: auth,
            name: auth.charAt(0).toUpperCase() + auth.slice(1),
            iconType: 'oneicon',
            iconName: 'key',
          });
        }
      });
      this.set('supportedAuthorizers', authorizers);
    });

    p.catch(error => {
      const msg = error && error.message || this.get('i18n').t('components.socialBoxList.fetchProvidersFailedUnknown');
      this.set('errorMessage', msg);
    });

    p.finally(() => this.set('isLoading', false));
  }.on('init'),

  authorizersSelectMatcher(authorizer, term) {
    return authorizer.name.toLowerCase().indexOf(term.toLowerCase());
  },

  actions: {
    authorizerSelected(authorizer) {
      this.set('selectedAuthorizer', authorizer);
      this.send('authenticate', authorizer.type);
    },
    // TODO: what if there is server error?
    /** Get a login endpoint URL from server and go to it */
    authenticate(providerName) {
      const p = this.get('onezoneServer').getLoginEndpoint(providerName);
      p.then(
        (data) => {
          window.location = data.url;
        },
        (error) => {
          this.get('messageBox').open({
            title: this.get('i18n').t('components.socialBoxList.error.title'),
            message: this.get('i18n').t('components.socialBoxList.error.message') +
              (error.message ? ': ' + error.message : ''),
            type: 'error'
          });
        }
      );
      return p;
    },
    usernameLoginToggle() {
      this.toggleProperty('isUsernameLoginActive');
    }
  }
});
