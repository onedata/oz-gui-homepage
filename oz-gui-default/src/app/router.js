import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('home', function() {
    ['login', 'logout'].forEach((homepagePage) => {
      this.route(homepagePage);
    });
  });

  this.route('onezone', function() {
    this.route('provider-redirect', { path: '/provider-redirect/:providerId'});
  });
});

export default Router;
