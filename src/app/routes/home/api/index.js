import PageBase from '../_page-base';
import Ember from 'ember'; 

const VERSIONS_PATH = '/swagger/versions.json'; 

export default PageBase.extend({
  name: 'api',

  model() {
    return new Ember.RSVP.Promise((resolve, reject) => {
      $.ajax({
        url: VERSIONS_PATH,
        dataType: 'json',
        success: (data) => resolve(data),
        error: () => reject()
      });
    });
  },

  redirect(model) {
    this._super(...arguments);
    let defaultVersion = model.default;
    let defaultComponent = model.components[0].id;
    this.transitionTo('home.api.show-api', Ember.Object.create({
      component: defaultComponent,
      version: defaultVersion
    }));
  },
});
