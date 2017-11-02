import Ember from 'ember';

const {
  RSVP: { Promise },
  inject
} = Ember;

/**
 * A service for managing and manipulaing spaces.
 * See public methods for details.
 * 
 * @module services/spaces-manager
 * @author Jakub Liput
 * @copyright (C) 2016-2017 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Ember.Service.extend({
  modalsManager: inject.service(),
  onezoneServer: inject.service(),
  i18n: inject.service(),
  store: inject.service(),
  notify: inject.service(),
  session: inject.service(),

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
   * @param {Space} space
   * @public
   */
  startRenameSpace(space) {
    let {i18n, modalsManager} =
      this.getProperties('i18n', 'modalsManager');
    let spaceName = space.get('name');

    modalsManager.openModal('rename', {
      onConfirm: (newName) => this._renameSpaceConfirmed(space, newName),
      onCancel: null,
      title: i18n.t('services.spacesManager.renameModal.title'),
      label: i18n.t('services.spacesManager.renameModal.label', {
        spaceName
      }),
      originalName: spaceName
    });
  },

  toggleSpaceAsDefault(space) {
    let user = this.get('session.user');
    user.set('defaultSpaceId',
      space.get('isDefault') ? null : space.get('id'));

    let userSave = user.save();
    userSave.catch(({message}) => {
      this.get('notify').error(this.get('i18n').t('onezone.spacesAccordionItem.toggleDefaultFailed', {
        errorMessage: message
      }));
      user.rollbackAttributes();
      let reloadUser = user.reload();
      reloadUser.catch(() => {
        console.warn('Reloading User model after alias set failure failed - rolling back local User record');
        user.rollbackAttributes();
      });
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
          spaceName: spaceName,
          errorMesssage: message || i18n.t('common.unknownError')
        }));
        reject(...arguments);
      });
    });
  },

  /**
   * @private
   */
  _renameSpaceConfirmed(space, newName) {
    let {notify, i18n} =
      this.getProperties('notify', 'i18n');
    let oldName = space.get('name');
    space.set('name', newName);
    return new Promise((resolve, reject) => {
      let savePromise = space.save();
      savePromise.then(() => {
        notify.info(i18n.t('services.spacesManager.renameModal.success', {
          oldName,
          newName: newName
        }));
        resolve(...arguments);
      });
      savePromise.catch(({message: errorMessage}) => {
        notify.error(i18n.t('services.spacesManager.renameModal.failure', {
          oldName,
          errorMessage
        }));
        reject(...arguments);
      });
    });
  },

});
