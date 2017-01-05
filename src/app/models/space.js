import DS from 'ember-data';

const {
  attr,
  hasMany
} = DS;

/**
 * Space representation.
 * @module models/space
 * @author Jakub Liput
 * @copyright (C) 2016 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default DS.Model.extend({
  name: attr('string'),

  /**
   * Total capacity in bytes of this space.
   * @type {Number}
   */
  totalSize: attr('number'),

  /**
   * Maps: provider name => capacity in bytes provided for this space
   * @type {Object}
   */
  supportSizes: attr('object'),

  /**
   * If true, user can view list of providers that support this space.
   * @type {Boolean}
   */
  hasViewPrivilege: attr('boolean'),

  /*** Relations ***/

  /**
   * List of Providers that support this space
   * @type {Provider[]}
   */
  providers: hasMany('provider', {async: true}),
});
