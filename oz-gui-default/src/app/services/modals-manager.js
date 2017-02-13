import Ember from 'ember';

export default Ember.Service.extend({
  currentModal: Ember.Object.create({
    type: null,
    options: Ember.Object.create({})
  }),

  _resetProperties() {
    this.get('currentModal').setProperties({
      type: null,
      options: null
    });
  },

  openModal(type, options) {
    if (typeof options === 'object') {
      options = Ember.Object.create(options);
    }
    let currentModal = this.get('currentModal');
    currentModal.setProperties({
      type, options
    });
  },

  closeModal(type) {
    let currentModal = this.get('currentModal');
    let {type: currentModalType} =
      currentModal.getProperties('type');
    if (currentModalType === type) {
      this._resetProperties();
    } else {
      console.debug(`service:modals-manager: Tried to close modal that is not opened: ${currentModalType}`);
    }
  }
});
