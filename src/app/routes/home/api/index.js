import PageBase from '../_page-base';
import Ember from 'ember';

/**
 * Redirect to default API version and component.
 *  
 * @module routes/home/api/index
 * @author Jakub Liput
 * @copyright (C) 2016 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default PageBase.extend({
  /**
   * See model of ``routes/home/api``
   */
  model() {
    return this.modelFor('home.api');
  },

  redirect(model) {
    this._super(...arguments);
    let defaultVersion = model.default;
    let defaultComponent = model.components[0].id;
    this.transitionTo('home.api.show-api', Ember.Object.create({
      apiComponent: defaultComponent,
      apiVersion: defaultVersion
    }));
  },
});
