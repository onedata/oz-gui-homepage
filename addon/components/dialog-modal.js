import Ember from 'ember';
import layout from '../templates/components/dialog-modal';

export default Ember.Component.extend({
  layout,

  open: false,

  title: null,
  label: null,
  type: "question",

  onConfirm: null,
  onCancel: null,

  // FIXME
  btnClass: null,

  actions: {
    buttonClicked(confirmed=false) {
      let fun = confirmed ? this.get('onConfirm') : this.get('onCancel');
      if (fun) {
        fun().finally(() => {
          this.sendAction('close');
        });
      } else {
        this.sendAction('close');
      }
    },

    confirm() {
      this.sendAction('buttonClicked', true);
    },

    cancel() {
      this.sendAction('buttonClicked', false);
    },

    close() {
      this.set('open', false);
      // TODO: after close, reset properties
    }
  }

  
});
