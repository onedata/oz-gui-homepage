import Ember from 'ember';

const {
  Controller,
  computed,
  computed: {
    alias,
    reads,
  },
  inject,
  observer,
  run: { scheduleOnce },
} = Ember;

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
export default Controller.extend({
  apiController: inject.controller('home.api'),

  queryParams: ['anchor'],
  anchor: null,

  /**
   * Should contain default version of API.
   * Should be set by route in ``setupController``.
   * @type {String}
   */
  defaultVersion: null,

  /**
   * @type {number|null}
   */
  documentLoadStatus: null,

  apiComponent: alias('model.apiComponent'),
  apiVersion: alias('model.apiVersion'),
  iframeSrcLoading: reads('apiController.iframeSrcLoading'),

  /**
   * A version of API passed to iframe with ReDoc.
   * As the iframe with API will read specific version,
   * we need to convert special version strings to specific versions.
   * Eg. stable to specific stable.
   * 
   * @type {computed<string>}
   */
  iframeApiVersion: computed(
    'apiVersion',
    'defaultVersion',
    function iframeApiVersion() {
      let apiVersion = this.get('apiVersion');
      if (apiVersion === 'stable') {
        return this.get('defaultVersion');
      } else {
        return apiVersion;
      }
    }
  ),

  apiComponentOrVersionUpdated: observer('apiComponent', 'apiVersion', function () {
    let { apiComponent, apiVersion } = this.getProperties('apiComponent',
      'apiVersion');
    this.set('documentLoadStatus', null);
    this.get('apiController').setProperties({ apiComponent, apiVersion });
  }),

  disableIframeSrcLoading: observer('documentLoadStatus',
    function disableIframeSrcLoading() {
      if (this.get('documentLoadStatus') >= 400) {
        this.set('apiController.iframeSrcLoading', false);
      }
    }),

  actions: {
    iframeSrcLoadingChanged(isLoading) {
      scheduleOnce('afterRender', this, () => {
        this.set('apiController.iframeSrcLoading', isLoading);
      });
    },
  },
});
