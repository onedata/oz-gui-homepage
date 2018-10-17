import Ember from 'ember';
import AuthenticationErrorMessage from 'oz-worker-gui/mixins/authentication-error-message';
import _ from 'lodash';
import handleLoginEndpoint from 'oz-worker-gui/utils/handle-login-endpoint';
import safeExec from 'ember-cli-onedata-common/utils/safe-method-execution';

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
export default Ember.Component.extend(AuthenticationErrorMessage, {
  onezoneServer: Ember.inject.service(),
  supportedAuthorizersService: Ember.inject.service('supportedAuthorizers'),
  messageBox: Ember.inject.service(),

  /**
   * Admin message provided by backend
   * @type {string}
   * @virtual
   */
  loginNotification: null,

  /**
   * List of authorizers
   * @type {Array.AuthorizerInfo}
   * 
   * Set by initSupportedAuthorizers
   */
  supportedAuthorizers: null,

  /**
   * Authorizer selected in dropdown
   * @type {AuthorizerInfo}
   */
  selectedAuthorizer: null,

  /**
   * Is login form with username/password active (visible)
   * @type {boolean}
   */
  isUsernameLoginActive: false,

  /**
   * @type {boolean}
   */
  isProvidersDropdownVisible: false,

  /**
   * @type {computed.boolean}
   */
  showMoreProvidersButton: computed.gt('supportedAuthorizers.length', 7),

  /**
   * A code of last authentication error (or null)
   * @type {string|null}
   */
  authenticationErrorReason: null,

  showAuthenticationError: false,

  dropdownAnimationTimeoutId: -1,
  formAnimationTimeoutId: -1,


  authorizersForButtons: computed('supportedAuthorizers.[]', function () {
    let {
      supportedAuthorizers,
      showMoreProvidersButton
    } = this.getProperties('supportedAuthorizers', 'showMoreProvidersButton');
    if (supportedAuthorizers) {
      return supportedAuthorizers.slice(0, showMoreProvidersButton ? 6 : 7);
    } else {
      return [];
    }
  }),

  authorizersForSelect: computed('supportedAuthorizers.[]', function () {
    let supportedAuthorizers = this.get('supportedAuthorizers');
    if (supportedAuthorizers) {
      return supportedAuthorizers.filter(auth => auth.id !== 'onepanel');
    } else {
      return [];
    }
  }),

  hasAuthorizersForSelect: computed.notEmpty('authorizersForSelect'),

  isLoading: false,
  errorMessage: null,

  _activeAuthorizer: null,

  /**
   * @type {Ember.ComputedProperty<string>}
   */
  loginBoxClasses: computed(
    'hasAuthorizersForSelect',
    'isUsernameLoginActive',
    'isProvidersDropdownVisible',
    function () {
      const {
        hasAuthorizersForSelect,
        isUsernameLoginActive,
        isProvidersDropdownVisible,
      } = this.getProperties(
        'hasAuthorizersForSelect',
        'isUsernameLoginActive',
        'isProvidersDropdownVisible'
      );
      let classes = hasAuthorizersForSelect & !isUsernameLoginActive ?
        'authorizers-login' : 'username-login';
      if (isProvidersDropdownVisible) {
        classes += ' with-authorizers-dropdown';
      }
      return classes;
    }
  ),

  init() {
    this._super(...arguments);
    if (this.get('authenticationErrorReason')) {
      this.set('showAuthenticationError', true);
    }
    this.initSupportedAuthorizers();
  },

  initSupportedAuthorizers() {
    this.set('isLoading', true);
    this.get('supportedAuthorizersService').getSupportedAuthorizers()
      .then(({ authorizers }) => {
        safeExec(this, 'set', 'supportedAuthorizers', authorizers);
      })
      .catch(error => {
        const msg = error && error.message || this.get('i18n').t('components.socialBoxList.fetchProvidersFailedUnknown');
        this.set('errorMessage', msg);
      })
      .finally(() => this.set('isLoading', false));
  },

  didInsertElement() {
    this._super(...arguments);
    if (!this.get('hasAuthorizersForSelect')) {
      this.$('#-username-input').focus();
    }
  },

  authorizersSelectMatcher(authorizer, term) {
    return authorizer.name.toLowerCase().indexOf(term.toLowerCase());
  },

  _animateShow(element, delayed) {
    element
      .addClass((delayed ? 'short-delay ' : '') + 'fadeIn')
      .removeClass('hide fadeOut');
  },

  _animateHide(element) {
    element.addClass('fadeOut').removeClass('short-delay fadeIn');
  },

  authEndpointError(error) {
    this.get('messageBox').open({
      title: this.get('i18n').t('components.socialBoxList.error.title'),
      message: this.get('i18n').t('components.socialBoxList.error.message') +
        (error.message ? ': ' + error.message : ''),
      type: 'error'
    });
  },
  
  actions: {
    authorizerSelected(authorizer) {
      this.set('selectedAuthorizer', authorizer);
      this.send('authenticate', authorizer.id);
    },
    // TODO: what if there is server error?
    /** Get a login endpoint URL from server and go to it */
    authenticate(providerName) {
      let provider = _.find(this.get('supportedAuthorizers'), { type: providerName });
      this.set('_activeAuthorizer', provider);
      const p = this.get('onezoneServer').getLoginEndpoint(providerName);
      p.then(
        (data) => {
          handleLoginEndpoint(data, () => {
            this.authEndpointError({
              message: this.get('i18n').t('login.endpointError')
            });
          });
        },
        (error) => {
          this.authEndpointError(error);
        }
      ).then(() => {
        this.setProperties({
          _activeAuthorizer: null,
          selectedAuthorizer: null,
        });
      });
      return p;
    },
    usernameLoginToggle() {
      let {
        isProvidersDropdownVisible,
        formAnimationTimeoutId
      } = this.getProperties(
        'isProvidersDropdownVisible',
        'formAnimationTimeoutId'
      );
      let loginForm = this.$('.login-form-container');
      let authorizersSelect = this.$('.authorizers-select-container');
      clearTimeout(formAnimationTimeoutId);

      this.toggleProperty('isUsernameLoginActive');
      if (this.get('isUsernameLoginActive')) {
        this._animateHide(authorizersSelect);
        this._animateShow(loginForm, true);
        this.$('#-username-input').focus();
        // hide dropdown
        if (isProvidersDropdownVisible) {
          this.send('showMoreClick');
        }
      } else {
        this._animateHide(loginForm);
        this._animateShow(authorizersSelect, true);
        this.set('formAnimationTimeoutId', 
          setTimeout(() => loginForm.addClass('hide'), 333)
        );
      }
    },
    showMoreClick() {
      let dropdownAnimationTimeoutId = this.get('dropdownAnimationTimeoutId');
      this.toggleProperty('isProvidersDropdownVisible');
      let authorizersDropdown = this.$('.authorizers-dropdown-container');
      clearTimeout(dropdownAnimationTimeoutId);
      if (this.get('isProvidersDropdownVisible')) {
        this._animateShow(authorizersDropdown);
      } else {
        this._animateHide(authorizersDropdown);
        this.set('dropdownAnimationTimeoutId', 
          setTimeout(() => authorizersDropdown.addClass('hide'), 333)
        );
      }
    },
    back() {
      this.set('showAuthenticationError', false);
    },
  }
});
