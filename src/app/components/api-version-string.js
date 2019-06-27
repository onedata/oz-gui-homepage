/**
 * Name of version in API versions selector.
 * Can be used with special name or only version string.
 * 
 * @module components/api-version-string
 * @author Jakub Liput
 * @copyright (C) 2019 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */

import Ember from 'ember';

const {
  Component,
} = Ember;

export default Component.extend({
  tagName: 'span',
  classNames: ['api-version-string'],
  classNameBindings: ['name:has-name'],

  /**
   * Exact version string e.g. 18.02.1
   * @type {string}
   */
  version: '',

  /**
   * Special name if needed, displayed before exact version, e.g. "stable"
   * @type {string}
   */
  name: '',
});
