import Ember from 'ember';
import PromiseLoadingMixin from '../../mixins/promise-loading';

// FIXME: doc
export default Ember.Component.extend(PromiseLoadingMixin, {
  onezoneServer: Ember.inject.service(),

  /** @abstract */
  modalId: null,

  open: false,
  isLoading: false,

  usernameText: null,
  passwordText: null,

  /** Will be filled when login POST request fail */
  errorMessage: null,

  isSubmitEnabled: function() {
    return !this.get('isLoading') &&
      this.get('oldPasswordText') && this.get('newPasswordText') &&
      this.get('newPasswordText') === this.get('retypeNewPasswordText');
  }.property('isLoading', 'oldPasswordText', 'newPasswordText', 'retypeNewPasswordText'),

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
      const newPassword = this.get('newPasswordText');
      const oldPassword = this.get('oldPasswordText');

      this.promiseLoading(
        this.get('onezoneServer').changePassword(oldPassword, newPassword)
      ).then(
        () => {
          this.set('open', false);
          // TODO: notify - password changed successfully
        },
        (error) => {
          this.set('errorMessage', error.message);
        }
      );
    },
  }


});
