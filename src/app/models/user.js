import DS from 'ember-data';

const {
  attr,
  belongsTo,
  hasMany
} = DS;

const ASYNC_ONEWAY = { async: true, inverse: null };

// FIXME jsdoc
export default DS.Model.extend({
  name: attr('string'),
  alias: attr('string'),
  basicAuthEnabled: attr('boolean'),
  authorizers: attr('array'),

  /*** Relations ***/

  defaultSpace: belongsTo('space', ASYNC_ONEWAY),
  defaultProvider: belongsTo('provider', ASYNC_ONEWAY),

  clientTokens: hasMany('clienttokens', ASYNC_ONEWAY),
  groups: hasMany('group', ASYNC_ONEWAY),
  spaces: hasMany('spaces', ASYNC_ONEWAY),
  providers: hasMany('provider', ASYNC_ONEWAY),
});
