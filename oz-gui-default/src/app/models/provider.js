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
 * A Oneprovider host representation, available for user.
 * @module
 * @author Jakub Liput
 * @copyright (C) 2016-2017 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default DS.Model.extend(isDefaultMixinFactory('defaultProviderId'), {
  session: inject.service(),

  name: attr('string'),
  isWorking: attr('boolean', { defaultValue: false }),

  /**
   * Hostname of this provider
   * @type {String}
   */
  host: attr('string'),

  /**
   * North (-90..90)
   * @type {Number}
   */
  latitude: attr('number'),

  /**
   * East (-180..180)
   * @type {Number}
   */
  longitude: attr('number'),

  /*** Relations ***/

  spaces: hasMany('space', { async: true }),

  /*** Runtime properties ***/

  /**
   * Is provider selected in GUI
   * @type {Boolean}
   * @public
   */
  isSelected: false,

  user: belongsTo('user', {async: true})

  /*** Additional computed properties ***/

  /**
   * Implemented by ``IsDefault`` mixin
   * @abstract 
   * @property {boolean} isDefault
   */
});
