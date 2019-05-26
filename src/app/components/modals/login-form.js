import Ember from 'ember';
import ModalMixin from 'ember-cli-onedata-common/mixins/components/modal';
import PromiseLoadingMixin from 'ember-cli-onedata-common/mixins/promise-loading';

/**
 * A form for logging in with username and password (invoked by one of login buttons)
 * @module components/modals/login-form
 * @author Jakub Liput
 * @copyright (C) 2016 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Ember.Component.extend(ModalMixin, PromiseLoadingMixin, {
  /** @abstract */
  modalId: null,

  open: false,
  isLoading: false,

  usernameText: null,
  passwordText: null,

  /**
   * @implements ModalMixin
   */
  i18nPrefixKey: 'components.modals.loginForm',

  /** @implements ModalMixin */
  message: null,

  /**
   * @implements ModalMixin
   */
  messageType: null,

  init() {
    this._super(...arguments);
    this.setProperties({
      open: false
    });
  },

  isSubmitEnabled: function() {
    return !this.get('isLoading') && this.get('usernameText') && this.get('passwordText');
  }.property('isLoading', 'usernameText', 'passwordText'),

  actions: {
    open() {
      this.setProperties({
        usernameText: null,
        passwordText: null,
        message: null,
        messageType: null,
      });
    },

    submit() {
      this.setProperties({
        isLoading: true,
        message: null,
        messageType: null,
      });
      const username = this.get('usernameText');
      const password = this.get('passwordText');

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
            jqXHR.reponseText: ${jqXHR.responseText}`
          );
          component.setProperties({
            isLoading: false,
            messageType: 'success'
          });
          // timeout set to display a success message for a while
          setTimeout(function () {
            if (data.url) {
              window.location = data.url;
            } else {
              console.error("URL after basic auth login was not sent! Reloading location.");
              window.location.reload();
            }
          }, 500);
        },
        error: (jqXHR, textStatus, errorThrown) => {
          console.warn(`Authentication with login/password failed:
            errorThrown: ${errorThrown},
            textStatus: ${textStatus},
            jqXHR.reponseText: ${jqXHR.responseText}`
          );
          component.setProperties({
            isLoading: false,
            message: jqXHR.statusText + (jqXHR.reponseText ? `: ${jqXHR.reponseText}` : ''),
            messageType: 'danger'
          });
        }
      });

    },
  }


});
