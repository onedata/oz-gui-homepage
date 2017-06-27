import Ember from 'ember';
import AUTHORIZERS from 'oz-worker-gui/utils/authorizers';

const {
  computed,
} = Ember;

export default Ember.Component.extend({
  onezoneServer: Ember.inject.service(),
  messageBox: Ember.inject.service(),

  /**
   * Object with support mapping, eg. ``{plgrid: true, facebook: false}``
   * If authorizer is supported, its button will be displayed.
   * Allowed supporters: plgrid, dropbox, facebook, google, rhea
   *
   * Set by initSupportedAuthorizers
   */
  supportedAuthorizers: null,

  selectedAuthorizer: null,
  
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
      // let predefinedAuthorizersList = AUTHORIZERS.map(auth => auth.type);
      // this.set('supportedAuthorizers', data.authorizers.map(auth => {
      //   let authIndex = predefinedAuthorizersList.indexOf(auth);
      //   if (authIndex > -1) {
      //     return AUTHORIZERS[authIndex];
      //   }
      //   else {
      //     return {
      //       type: auth,
      //       iconType: 'oneicon',
      //       iconName: 'key',
      //     };
      //   }
      // }));
      this.set('supportedAuthorizers', AUTHORIZERS);
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
      // this.send('authenticate', authorizer.type);
    },
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
    }
  }
});
