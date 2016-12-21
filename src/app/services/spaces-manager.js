import Ember from 'ember';

const {RSVP: {Promise}} = Ember;

/**
 * A service for managing and manipulaing spaces.
 * See public methods for details.
 * 
 * @module services/spaces-manager
 * @author Jakub Liput
 * @copyright (C) 2016 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
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
    let {onezoneServer, notify, i18n} =
      this.getProperties('onezoneServer', 'notify', 'i18n');
    let {id: spaceId, name: spaceName} = space.getProperties('id', 'name');
    return new Promise((resolve, reject) => {
      let leavePromise = onezoneServer.userLeaveSpace(spaceId);
      leavePromise.then(() => {
        notify.info(i18n.t('services.spacesManager.leaveModal.success', {
          spaceName
        }));
        resolve(...arguments);
      });
      leavePromise.catch(({message}) => {
        notify.error(i18n.t('services.spacesManager.leaveModal.failure', {
          spaceName,
          errorMesssage: message || i18n.t('common.unknownError')
        }));
        reject(...arguments);
      });
    });
  },
});
