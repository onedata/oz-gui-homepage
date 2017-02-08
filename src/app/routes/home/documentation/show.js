import Ember from 'ember';

const {
  Route
} = Ember;

export default Route.extend({
  model({ gitbook_path }) {
    // FIXME do not allow to pass absolute URLs
    return gitbook_path;
  },

  setupController(controller, model) {
    this._super(...arguments);
    controller.set('startGitbookPath', model);
  },

  actions: {
    gitbookPathChanged(path) {
      this.transitionTo('home.documentation.show', path);
    }
  }
});