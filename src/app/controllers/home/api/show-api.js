import Ember from 'ember';

/**
 * Needed for:
 * - updating ``api`` controller properties after API version and component choose (in route)
 * - handling ``anchor`` optional query param for handling section/tag/operation jumping in ReDoc
 * - helping template by exposing variables
 *  
 * @module controllers/home/api/show-api
 * @author Jakub Liput
 * @copyright (C) 2016 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Ember.Controller.extend({
  apiController: Ember.inject.controller('home.api'),

  queryParams: ['anchor'],
  anchor: null,

  apiComponent: Ember.computed.alias('model.apiComponent'),
  apiVersion: Ember.computed.alias('model.apiVersion'),

  apiComponentOrVersionUpdated: Ember.observer('apiComponent', 'apiVersion', function() {
    let {apiComponent, apiVersion} = this.getProperties('apiComponent', 'apiVersion');
    this.get('apiController').setProperties({apiComponent, apiVersion});
  }),
});
