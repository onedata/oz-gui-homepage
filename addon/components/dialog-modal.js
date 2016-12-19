import Ember from 'ember';
import layout from '../templates/components/dialog-modal';

export default Ember.Component.extend({
  layout,

  open: false,

  title: null,
  label: null,
  type: "question",

  /**
   * A function to invoke when submit action resolved or rejected.
   * The first arguments passed is true/false - is submit promise resolved?
   * @type {Function}
   */
  resolve: null,

  // FIXME: implement
  /**
   * A function to ivoke when user chose "no"
   * @type {Function}
   */
  reject: null,

  yesAction: null,

  // FIXME
  btnClass: null,

  actions: {
    submit() {
      let {resolve, model} =
        this.getProperties('resolve', 'model');
      
      let submitPromise = new Ember.RSVP.Promise((submitResolve, submitReject) => {
        this.sendAction('yesAction', {
          resolve: submitResolve,
          reject: submitReject,
          model
        });
      });

      submitPromise.then(() => resolve && resolve(true, ...arguments));
      submitPromise.catch(() => resolve && resolve(false, ...arguments));
      // FIXME: what to do on reject? - now closing dialog
      submitPromise.finally(() => this.set('open', false));
    }
  }

  
});
