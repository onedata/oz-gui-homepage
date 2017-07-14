import Ember from 'ember';

/**
 * Content of onezone application - a world map with providers.
 * @module routes/home/onezone/index
 * @author Jakub Liput
 * @copyright (C) 2016-2017 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Ember.Route.extend({
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
