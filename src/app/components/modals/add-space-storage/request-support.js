import TabBase from 'oz-worker-gui/components/modals/add-space-storage/-tab-base';

export default TabBase.extend({
  actions: {
    getToken() {
      return this.get('getToken')(...arguments);
    }
  },
});
