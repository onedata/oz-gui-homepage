import Ember from 'ember';

const {
  inject: {
    service
  },
  computed: {
    alias
  }
} = Ember;

/**
 * Used for loading state of view.
 * @module controllers/onezone/index
 * @author Jakub Liput
 * @copyright (C) 2016-2017 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Ember.Controller.extend({
  onezoneSidebar: service(),

  providers: alias('model'),
  isLoading: alias('providers.isUpdating'),

  actions: {
    expandSpacesAndGroups() {
      let sidebar = this.get('onezoneSidebar');
      sidebar.expandMain('spaces');
      sidebar.expandMain('groups');
    },
    goToTab(tab) {
      let sidebar = this.get('onezoneSidebar');
      sidebar.expandMain(tab);
    }
  }
});
