import Ember from 'ember';

/**
 * Single user account (authorization provider) entry, like Google+.
 * @module components/account-item
 * @author Jakub Liput
 * @copyright (C) 2016 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Ember.Component.extend({
  classNames: ['account-item', 'clickable:clickable'],

  /** Label of entry, string */
  label: null,

  /** Type of authorizer, one of: google, plgrid, dropbox, google, facebook, github */
  type: null,

  /**
   * To inject. Optional.
   * @type {Boolean}
   */
  clickable: true,

  // TODO: DEPRECATED
  accepted: null,

  iconName: function() {
    return `social-${this.get('type')}`;
  }.property('type'),

  click() {
    this.sendAction('action', this.get('type'));
  }
});
