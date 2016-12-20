import Ember from 'ember';

const {RSVP: {Promise}} = Ember;

export default Ember.Service.extend({
  modalsManager: Ember.inject.service(),
  onezoneServer: Ember.inject.service(),
  i18n: Ember.inject.service(),
  store: Ember.inject.service(),

  /**
   * @param {Space} space
   * @public
   */
  startLeaveSpace(space) {
    let {i18n, modalsManager} =
      this.getProperties('i18n', 'modalsManager');

    modalsManager.openModal('dialog', {
      onConfirm: () => this._leaveSpaceConfirmed(space),
      onCancel: null,
      title: i18n.t('services.spacesManager.leaveModal.title'),
      label: i18n.t('services.spacesManager.leaveModal.label', {
        spaceName: space.get('name')
      })
    });
  },

  /**
   * @private
   */
  _leaveSpaceConfirmed(space) {
    let server = this.get('onezoneServer');
    return new Promise((resolve, reject) => {
      let leavePromise = server.userLeaveSpace(space.get('id'));
      leavePromise.then(() => {
        // FIXME: notify
        resolve(...arguments);
      });
      leavePromise.catch(() => {
        // FIXME: notify or persistent message
        reject(...arguments);
      });
    });
  },
});
