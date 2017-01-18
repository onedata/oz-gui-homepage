import Ember from 'ember';

const {
  computed
} = Ember;

/**
 * Top bar of onezone.
 * @module components/onezone-top-bar
 * @author Jakub Liput
 * @copyright (C) 2016 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Ember.Component.extend({
  session: Ember.inject.service(),

  userName: computed.alias('session.user.name'),
});
