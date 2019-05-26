import Ember from 'ember';

const {
  Route
} = Ember;

export default Route.extend({
  redirect() {
    this._super(...arguments);
    this.transitionTo('home.documentation.show', 'index.html');
  }
});