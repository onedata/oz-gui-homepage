import Ember from 'ember';

const {RSVP: {Promise}} = Ember;

export default Ember.Service.extend({
  modalsManager: Ember.inject.service(),
  onezoneServer: Ember.inject.service(),
  i18n: Ember.inject.service(),
  store: Ember.inject.service(),
  notify: Ember.inject.service(),

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
    let {server, notify, i18n} =
      this.getProperties('onezoneServer', 'notify', 'i18n');
    let {spaceId, spaceName} = space.getProperties('id', 'name');
    return new Promise((resolve, reject) => {
      let leavePromise = server.userLeaveSpace(spaceId);
      leavePromise.then(() => {
        // FIXME: notify
        notify.info(i18n.t('services.spacesManager.leaveModal.success'));
        
        resolve(...arguments);
      });
      leavePromise.catch(({message}) => {
        notify.info(i18n.t('services.spacesManager.leaveModal.failure', {
          spaceName: spaceName,
          errorMesssage: message || i18n.t('common.unknownError')
        }));
        reject(...arguments);
      });
    });
  },
});
