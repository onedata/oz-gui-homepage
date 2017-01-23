import DS from 'ember-data';
import Ember from 'ember';

import isDefaultMixinFactory from 'ember-cli-onedata-common/mixin-factories/models/is-default';

const {
  attr,
  hasMany,
  belongsTo
} = DS;

const {
  inject
} = Ember;

/**
 * Space representation.
 * @module models/space
 * @author Jakub Liput
 * @copyright (C) 2016-2017 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default DS.Model.extend(isDefaultMixinFactory('defaultSpaceId'), {
  session: inject.service(),

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

  user: belongsTo('user', {async: true})

  /*** Additional computed properties ***/

  /**
   * Implemented by ``IsDefault`` mixin
   * @abstract 
   * @property {boolean} isDefault
   */
});
