import DS from 'ember-data';

const {
  attr,
  hasMany
} = DS;

/**
 * A singleton model (only single record of this model is used at runtime).
 * This is a root of all model tree that user of GUI can get from backend.
 * 
 * @module models/user
 * @author Jakub Liput
 * @copyright (C) 2017 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default DS.Model.extend({
  name: attr('string'),
  alias: attr('string'),
  basicAuthEnabled: attr('boolean'),

  defaultSpaceId: attr('string'),
  defaultProviderId: attr('string'),

  /*** Relations ***/

  authorizers: hasMany('authorizer', { async: true }),
  clienttokens: hasMany('clienttokens', { async: true }),
  groups: hasMany('group', { async: true }),
  spaces: hasMany('space', { async: true }),
  providers: hasMany('provider', { async: true }),
});
