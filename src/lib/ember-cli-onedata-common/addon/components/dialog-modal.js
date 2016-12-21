import Ember from 'ember';
import layout from '../templates/components/dialog-modal';

const {observer} = Ember;

const DEFAULT_TYPE = 'question';

const CHOICE_CLOSED = 0;
const CHOICE_OPENED = 1;
const CHOICE_CONFIRMED = 2;
const CHOICE_CANCELLED = 3;

export default Ember.Component.extend({
  layout,

  open: false,

  title: null,
  label: null,
  type: DEFAULT_TYPE,

  onConfirm: null,
  onCancel: null,

  /**
   * Additional classes for button.
   * @default "btn-primary"
   * @type {String}
   * @public
   */
  btnClass: 'btn-primary',

  choice: CHOICE_CLOSED,

  init() {
    this._super(...arguments);
  },

  _resetProperties() {
    this.setProperties({
      title: null,
      label: null,
      type: DEFAULT_TYPE,
      choice: CHOICE_CLOSED
    });
  },

  handleChoice(confirmed = false) {
    let fun = confirmed ? this.get('onConfirm') : this.get('onCancel');
    if (fun) {
      fun().finally(() => {
        this.send('close');
      });
    } else {
      this.send('close');
    }
  },

  choiceChanged: observer('choice', function() {
    let choice = this.get('choice');
    if (choice === CHOICE_CONFIRMED || choice === CHOICE_CANCELLED) {
      this.handleChoice(choice === CHOICE_CONFIRMED);
    }
  }),

  actions: {
    confirm() {
      this.set('choice', CHOICE_CONFIRMED);
    },

    cancel() {
      this.set('choice', CHOICE_CANCELLED);
    },

    close() {
      this.sendAction('closeModal', 'dialog');
    },

    open() {
      this.set('choice', CHOICE_OPENED);
    },

    closed() {
      let choice = this.get('choice');
      if (choice === CHOICE_OPENED) {
        // choice not yet set - we closed the window, so we cancelled operation
        this.set('choice', CHOICE_CANCELLED);
      }
      this._resetProperties();
    },
  }


});
