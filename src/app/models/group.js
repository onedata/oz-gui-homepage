import DS from 'ember-data';

const {
  attr,
  belongsTo
} = DS;

// FIXME jsdoc
export default DS.Model.extend({
  name: attr('string'),

  user: belongsTo('user', {async: true})
});
