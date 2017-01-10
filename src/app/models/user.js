import DS from 'ember-data';

const {
  attr,
  hasMany
} = DS;

const ASYNC_ONEWAY = { async: true, inverse: null };

// FIXME jsdoc
export default DS.Model.extend({
  name: attr('string'),
  alias: attr('string'),
  basicAuthEnabled: attr('boolean'),

  defaultSpaceId: attr('string'),
  defaultProviderId: attr('string'),

  /*** Relations ***/

  authorizers: hasMany('authorizer', ASYNC_ONEWAY),
  clienttokens: hasMany('clienttokens', ASYNC_ONEWAY),
  groups: hasMany('group', ASYNC_ONEWAY),
  spaces: hasMany('space', ASYNC_ONEWAY),
  providers: hasMany('provider', ASYNC_ONEWAY),
});
