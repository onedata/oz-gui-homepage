import Ember from 'ember';
import PromiseLoadingMixin from 'ember-cli-onedata-common/mixins/promise-loading';

const {
  observer,
  inject: {
    service
  },
} = Ember;

/**
 * A form for logging in with username and password (invoked by one of login buttons)
 * @module components/login-form
 * @author Jakub Liput, Michal Borzecki
 * @copyright (C) 2016-2017 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Ember.Component.extend(PromiseLoadingMixin, {
  classNames: ['login-form'],

  notify: service(),
  i18n: service(),

  i18nPrefixKey: 'components.modals.loginForm',
  isLoading: false,
  isOpen: false,
  message: null,

  usernameText: null,
  passwordText: null,

  isOpenObserver: observer('isOpen', function () {
    if (this.get('isOpen')) {
      this.setProperties({
        usernameText: '',
        passwordText: '',
        message: null,
      });
    }
  }),

  init() {
    this._super(...arguments);
    this.setProperties({
      open: false
    });
  },

  isSubmitEnabled: function () {
    return !this.get('isLoading') && this.get('usernameText') && this.get('passwordText');
  }.property('isLoading', 'usernameText', 'passwordText'),

  actions: {
    submit() {
      let {
        i18nPrefixKey,
        usernameText: username,
        passwordText: password,
        i18n
      } = this.getProperties('i18nPrefixKey', 'usernameText', 'passwordText', 'i18n');

      this.setProperties({
        isLoading: true,
        message: null,
      });

      const component = this;

      $.ajax('/do_login', {
        method: 'POST',
        // make a BasicAuth HTTP header
        beforeSend: (xhr) => {
          xhr.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password));
        },
        success: (data, textStatus, jqXHR) => {
          console.debug(`Authentication with login/password succeeded:
            data: ${data},
            textStatus: ${textStatus},
            jqXHR.reponseText: ${jqXHR.responseText}`);
          component.setProperties({
            isLoading: false
          });
          this.get('notify').success(i18n.t(i18nPrefixKey + '.success'));
          if (data.url) {
            window.location = data.url;
          } else {
            console.error("URL after basic auth login was not sent! Reloading location.");
            window.location.reload();
          }
        },
        error: (jqXHR, textStatus, errorThrown) => {
          console.warn(`Authentication with login/password failed:
            errorThrown: ${errorThrown},
            textStatus: ${textStatus},
            jqXHR.reponseText: ${jqXHR.responseText}`);
          component.setProperties({
            isLoading: false,
            message: jqXHR.statusText + (jqXHR.reponseText ? `: ${jqXHR.reponseText}` : ''),
          });
        }
      });
    },
  }
});
