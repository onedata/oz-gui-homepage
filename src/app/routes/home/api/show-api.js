import Ember from 'ember';

const {
  Route,
  assert,
  RSVP: {
    Promise
  }
} = Ember;

/**
 * A route for displaying API doc for specific version and Onedata component. 
 * @module routes/home/api/show-api
 * @author Jakub Liput
 * @copyright (C) 2016 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Route.extend({
  /**
   * The model is an Ember.Object with properties:
   * - apiComponent: String
   * - apiVersion: String
   * @type {Ember.Object}
   */
  model({api_component, api_version}) {
    return new Promise((resolve, reject) => {
      // if want to implement json-not-found error handler
      // do it here by checking if json is present by GET
      if (api_component && api_version) {
        resolve(Ember.Object.create({
          apiComponent: api_component,
          apiVersion: api_version
        }));
      } else {
        reject();
      }
    });
  },

  redirect({ apiComponent, apiVersion }) {
    if (apiVersion === 'latest') {
      const apiModel = this.modelFor('home.api');
      this.transitionTo('home.api.show-api', {
        apiComponent,
        apiVersion: apiModel.order[0],
      });
    }
  },
  
  setupController(controller/*, model*/) {
    this._super(...arguments);
    let apiModel = this.modelFor('home.api');
    assert(
      apiModel && apiModel.hasOwnProperty('default'),
      'apiModel should be non-null and include non-empty "default" attribute'
    );
    controller.set('defaultVersion', apiModel.default);
  },

  serialize({apiVersion, apiComponent}) {
    return {
      api_version: apiVersion,
      api_component: apiComponent,
    };
  }
});
