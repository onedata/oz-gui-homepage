import Ember from 'ember';

/**
 * FIXME: jsdoc
 * @module routes/home/api/show-api
 * @author Jakub Liput
 * @copyright (C) 2016 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Ember.Route.extend({
  /**
   * The model is an Ember.Object with properties:
   * - apiComponent: String
   * - apiVersion: String
   * @type {Ember.Object}
   */
  model({api_component, api_version}) {
    return new Ember.RSVP.Promise((resolve, reject) => {
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

  serialize({apiVersion, apiComponent}) {
    return {
      api_version: apiVersion,
      api_component: apiComponent,
    };
  }
});
