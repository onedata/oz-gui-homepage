import PageBase from '../_page-base';
import Ember from 'ember';

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
