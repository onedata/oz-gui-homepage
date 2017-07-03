import Ember from 'ember';
import AUTHORIZERS from 'oz-worker-gui/utils/authorizers';

const {
  computed,
} = Ember;

/**
 * A component that allows login by one of the supported authorization providers 
 * (specified by `supportedAuthorizers`) or by username and password (if possible). 
 * Shows a list of authorizers and a login form.
 * @module components/login-box
 * @author Jakub Liput, Michal Borzecki
 * @copyright (C) 2016-2017 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Ember.Component.extend({
  onezoneServer: Ember.inject.service(),
  messageBox: Ember.inject.service(),

  /**
   * List of authorizers
   * @type {Array.Authorizer}
   * 
   * Set by initSupportedAuthorizers
   */
  supportedAuthorizers: null,

  /**
   * Authorizer selected in dropdown
   * @type {Authorizer}
   */
  selectedAuthorizer: null,

  /**
   * Is login form with username/password active (visible)
   * @type {boolean}
   */
  isUsernameLoginActive: false,

  authorizersForButtons: computed('supportedAuthorizers.[]', function () {
    let supportedAuthorizers = this.get('supportedAuthorizers');
    if (supportedAuthorizers) {
      return supportedAuthorizers.slice(0, 7);
    } else {
      return [];
    }
  }),

  authorizersForSelect: computed('supportedAuthorizers.[]', function () {
    let supportedAuthorizers = this.get('supportedAuthorizers');
    if (supportedAuthorizers) {
      return supportedAuthorizers.filter(auth => auth.type !== 'basicAuth');
    } else {
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
            name: auth.capitalize(),
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

  _animateShow(element) {
    element.addClass('short-delay fadeIn').removeClass('fadeOut');
  },

  _animateHide(element) {
    element.addClass('fadeOut').removeClass('short-delay fadeIn');
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
      let loginForm = this.$('.login-form-container');
      let authorizersDropdown = this.$('.authorizers-dropdown-container');

      this.toggleProperty('isUsernameLoginActive');
      if (this.get('isUsernameLoginActive')) {
        this._animateHide(authorizersDropdown);
        this._animateShow(loginForm);
      } else {
        this._animateHide(loginForm);
        this._animateShow(authorizersDropdown);
      }
    }
  }
});
