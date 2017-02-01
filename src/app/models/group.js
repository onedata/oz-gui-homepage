import DS from 'ember-data';

const {
  attr,
  belongsTo
} = DS;

/**
 * Represents a group to which a user can belong.
 * @module models/group
 * @author Jakub Liput
 * @copyright (C) 2017 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default DS.Model.extend({
  name: attr('string'),

  user: belongsTo('user', {async: true})
});
