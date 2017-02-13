import DS from 'ember-data';

const {
  belongsTo
} = DS;

/**
 * A client token (access token). It uses only id, which is given from server.
 * @module models/clienttoken
 * @author Jakub Liput
 * @copyright (C) 2016-2017 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default DS.Model.extend({
  user: belongsTo('user', {async: true})
});
