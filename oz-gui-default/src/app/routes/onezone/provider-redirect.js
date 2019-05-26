/**
 * Redirect to some provider (URL got from backend).
 * 
 * @module routes/home/onezone/provider-redirect
 * @author Jakub Liput
 * @copyright (C) 2016-2018 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */

import Ember from 'ember';
import RedirectRoute from 'ember-cli-onedata-common/mixins/routes/redirect';

export default Ember.Route.extend(RedirectRoute, {
  /** 
   * @override
   */
  checkComeFromOtherRoute(currentHash) {
    return !/\/onezone\/provider-redirect/.test(currentHash);
  },
      
  model({ providerId }) {
    let user = this.modelFor('onezone');
    let providers = user.get('providers');
    let provider = providers.filter(p => p.get('id') === providerId)[0];
    
    return provider;
  },

  setupController(controller, provider) {
    this._super(...arguments);
    controller.goToFiles(provider.get('id'));
  },
  
  renderTemplate() {
    this.render({
      into: 'application'
    });
  },
});
