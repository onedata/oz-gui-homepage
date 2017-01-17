import Ember from 'ember';

const {
  inject
} = Ember;

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
  onezoneServer: inject.service(),
  i18n: inject.service(),
  store: inject.service(),
  notify: inject.service(),
  session: inject.service(),

  toggleProviderAsDefault(provider) {
    let user = this.get('session.user');

    user.set('defaultProviderId',
      provider.get('isDefault') ? null : provider.get('id'));

    let userSave = user.save();
    userSave.catch(({
      message
    }) => {
      this.get('notify').error(this.get('i18n').t('onezone.providersAccordionItem.toggleDefaultFailed', {
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
});
