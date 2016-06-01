import Ember from 'ember';
import PromiseLoadingMixin from '../../mixins/promise-loading';

// FIXME: jsdoc
export default Ember.Component.extend(PromiseLoadingMixin, {
  /** @abstract */
  modalId: null,

  open: false,
  isLoading: false,

  usernameText: null,
  passwordText: null,

  /** Will be filled when login POST request fail */
  errorMessage: null,

  isSubmitEnabled: function() {
    return !this.get('isLoading') && this.get('usernameText') && this.get('passwordText');
  }.property('isLoading', 'usernameText', 'passwordText'),

  actions: {
    open() {
      this.setProperties({
        usernameText: null,
        passwordText: null,
        errorMessage: null,
      });
    },

    opened() {
      // currently blank
    },

    submit() {
      this.setProperties({
        isLoading: true,
        errorMessage: null
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
          window.location.reload();
        },
        error: (jqXHR, textStatus, errorThrown) => {
          console.warn(`Authentication with login/password failed:
            errorThrown: ${errorThrown},
            textStatus: ${textStatus},
            jqXHR.reponseText: ${jqXHR.responseText}`
          );
          component.setProperties({
            isLoading: false,
            errorMessage: jqXHR.statusText + (jqXHR.reponseText ? `: ${jqXHR.reponseText}` : '')
          });
        }
      });

    },
  }


});
