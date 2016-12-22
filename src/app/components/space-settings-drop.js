import Ember from 'ember';
import SettingsDrop from 'ember-cli-onedata-common/components/settings-drop';
import SettingsDropLayout from 'ember-cli-onedata-common/templates/components/settings-drop';

/**
 * Drop-right menu for single space, conaining i.a. rename space, remove space etc.
 * Component does not have spaces manipulation logic - actions are sent to parent components or services.
 * @module components/space-settings-drop
 * @author Jakub Liput
 * @copyright (C) 2016 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default SettingsDrop.extend({
  spacesManager: Ember.inject.service(),

  layout: SettingsDropLayout,

  type: 'space',

  /**
    Items in "space settings" dropright menu
    Each item has properties:
    ```
    {
      icon: <string> - name of oneicon,
      label: <string> - label to show in menu (please use i18n service),
      action: <string> - name of action of this component
    }
    ```
  */
  menuItems: Ember.computed('i18n', 'space.isDefault', function() {
    let i18n = this.get('i18n');
    let spaceIsDefault = this.get('space.isDefault');
    let toggleHomeItem = {
      icon: 'home',
      label: i18n.t('components.spaceSettingsDrop.setHome'),
      action: 'toggleDefault'
    };
    let items = [];
    if (!spaceIsDefault) {
      items = items.concat(toggleHomeItem);
    }
    items = items.concat([
      {
        icon: 'rename',
        label: i18n.t('components.spaceSettingsDrop.rename'),
        action: 'renameSpace'
      },
      {
        icon: 'support',
        label: i18n.t('components.spaceSettingsDrop.getSupport'),
        action: 'getSupport'
      },
      {
        icon: 'leave-space',
        label: i18n.t('components.spaceSettingsDrop.leave'),
        action: 'leaveSpace'
      }
    ]);
    return items;
  }),

  actions: {
    toggleDefault() {
      this.sendAction('toggleDefault');
    },

    leaveSpace() {
      let {spacesManager, space} =
        this.getProperties('spacesManager', 'space');
      
      spacesManager.startLeaveSpace(space);
    },

    renameSpace() {
      let {spacesManager, space} =
        this.getProperties('spacesManager', 'space');

      spacesManager.startRenameSpace(space);
    },

    getSupport() {
      this.sendAction('getSupport');
    }
  }
});
