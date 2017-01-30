import Ember from 'ember';

const {
  computed
} = Ember;

/**
 * List of groups that the User belongs to.
 * @module components/groups-panel
 * @author Jakub Liput
 * @copyright (C) 2017 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Ember.Component.extend({
  classNames: ['groups-panel', 'accordion-content', 'sidebar-list'],

  groups: null,

  isLoading: computed.alias('groups.isUpdating'),

  groupsSorting: ['type', 'email'],
  groupsSorted: computed.sort('groups', 'groupsSorting'),

  actions: {
    startJoinGroup() {
      this.set('isJoinGroupModalOpened', true);
    }
  }
});
