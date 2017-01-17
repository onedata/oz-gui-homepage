import DS from 'ember-data';

const {
  attr,
  hasMany
} = DS;

// FIXME jsdoc
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
