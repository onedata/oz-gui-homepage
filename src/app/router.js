import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('home', function() {
    [
      'get-started',
      'documentation',
      // 'community',
      // 'download',
      'support',
      // 'media',
      // 'blog',
      'login',
      'logout'
    ].forEach((homepagePage) => {
      this.route(homepagePage);
    });

    this.route('api', function() {
      this.route('component', {path: ':component_id'}, function() {
        this.route('version', {path: ':version'});
      });
    });
  });

  this.route('onezone', function() {});
});

export default Router;
