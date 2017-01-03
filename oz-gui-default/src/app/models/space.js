import DS from 'ember-data';

/**
 * Space representation.
 * @module models/space
 * @author Jakub Liput
 * @copyright (C) 2016 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default DS.Model.extend({
  name: DS.attr('string'),

  /**
   * Total capacity in bytes of this space.
   * @type {Number}
   */
  totalSize: DS.attr('number'),

  /**
   * Maps: provider name => capacity in bytes provided for this space
   * @type {Object}
   */
  supportSizes: DS.attr('object'),

  /** isDefault is old form of "is home a space" - only one user space can be default */
  isDefault: DS.attr('boolean', {defaultValue: false}),

  /** List of models of providers that support this space */
  providers: DS.hasMany('provider', {async: true}),

  /**
   * If true, user can view list of providers that support this space.
   * @type {Boolean}
   */
  hasViewPrivilege: DS.attr('boolean'),
});
