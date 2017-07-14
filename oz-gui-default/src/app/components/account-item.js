import Ember from 'ember';

const {
  computed,
  String: { htmlSafe },
} = Ember;

/**
 * Single user account (authorization provider) entry, like Google+.
 * @module components/account-item
 * @author Jakub Liput
 * @copyright (C) 2016-2017 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Ember.Component.extend({
  classNames: ['account-item', 'secondary-item-container'],
  classNameBindings: ['clickable:clickable:'],

  /** Label of entry, string */
  label: null,

  /** Type of authorizer, one of:
   * google, plgrid, dropbox, google, facebook, github, rhea, elixir
   */
  type: null,

  /**
   * To inject. Optional.
   * @type {Boolean}
   */
  clickable: true,

  // TODO: DEPRECATED
  accepted: null,

  /**
   * Use oneicon (fonticon) or image placed in ``/assets/images/social/{type}.{iconType}``
   * @type {string} one of: oneicon, png, jpg, svg, <or other image format>
   */
  iconType: 'oneicon',

  socialIconStyle: computed('iconName', 'iconType', function () {
    let {
      iconName,
      iconType,
    } = this.getProperties('iconName', 'iconType');
    let style = '';
    if (iconType !== 'oneicon') {
      style = `background-image: url(${iconName});`;
    } else {
      style = '';
    }
    return htmlSafe(style);
  }),

  iconName: computed('iconType', 'type', function() {
    let {
      type,
      iconType,
    } = this.getProperties('type', 'iconType');
    if (iconType === 'oneicon') {
      return `social-${this.get('type')}`;
    } else {
      return `/assets/images/social/${type}.${iconType}`;
    }
  }),

  click() {
    this.sendAction('action', this.get('type'));
  }
});
