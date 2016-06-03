import Ember from 'ember';
import PromiseLoadingMixin from '../../mixins/promise-loading';

const I18N_PREFIX_KEY = 'components.modals.loginForm';

// FIXME: jsdoc
export default Ember.Component.extend(PromiseLoadingMixin, {
  /** @abstract */
  modalId: null,

  open: false,
  isLoading: false,

  usernameText: null,
  passwordText: null,

  /** Will be filled when login POST request resolves - see messageType */
  message: null,

  /**
   * One of: success, danger to indicate type of message
   * Use "success" for request success and "danger" for failure
   */
  messageType: null,

  /** CSS class for Bootstrap alert panel which is displayed after request complete */
  alertClass: function() {
    return `alert-${this.get('messageType')}`;
  }.property('messageType'),

  /** A prefix of info message displayed as alert panel - e.g. "Error: <message>" */
  messagePrefix: function() {
    switch (this.get('messageType')) {
      case 'danger':
        return this.get('i18n').t(I18N_PREFIX_KEY + '.authenticationError');
      case 'success':
        return this.get('i18n').t(I18N_PREFIX_KEY + '.authenticationSuccess');
      default:
        return null;
    }
  }.property('messageType'),

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

    opened() {
      // currently blank
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
            window.location.reload();
          }, 300);
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
