import Ember from 'ember';

const {
  Route
} = Ember;

export default Route.extend({
  model({ gitbook_path }) {
    return gitbook_path;
  },

  setupController(controller, model) {
    this._super(...arguments);
    controller.set('gitbookPath', model);
  },

  actions: {
    gitbookPathChanged(path) {
      this.transitionTo('home.documentation.show', path);
    }
  }
});