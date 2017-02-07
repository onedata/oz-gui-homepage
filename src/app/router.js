import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('home', function() {
    [
      'get-started',
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
      this.route('show-api', {path: ':api_version/:api_component'});
    });

    this.route('documentation', function() {
      this.route('show', {path: ':gitbook_path'});
    });
  });

  this.route('onezone', function() {});
});

export default Router;
