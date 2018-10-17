import Ember from 'ember';
import contrast from 'npm:contrast';
import {
  defaultIconBackgroundColor,
  defaultIconPath,
  darkFgColor,
  lightFgColor,
} from 'oz-worker-gui/utils/auth-box-config';

const {
  computed,
  String: { htmlSafe },
} = Ember;

/**
 * Single user account (authorization provider) entry, like Google+.
 * @module components/account-item
 * @author Jakub Liput
 * @copyright (C) 2016-2018 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Ember.Component.extend({
  classNames: ['account-item', 'secondary-item-container'],
  classNameBindings: ['clickable:clickable:'],

  /**
   * @virtual optional
   * @type {function}
   */
  action: () => {},
  
  /**
   * @virtual
   * Label of entry, string
   * @type {string}
   */
  label: undefined,

  /**
   * @virtual 
   * Id of authorizer, e.g. google, plgrid, dropbox, google, facebook, ...
   * @type {string}
   */
  authId: undefined,

  /**
   * @virtual
   * @type {string}
   */
  iconPath: defaultIconPath,
  
  /**
   * @virtual
   * @type {string}
   */
  iconBackgroundColor: defaultIconBackgroundColor,
  
  /**
   * @virtual optional
   * @type {Boolean}
   */
  clickable: true,

  /**
   * @type {Ember.ComputedProperty<string>}
   */
  socialIconStyle: computed(
    'authId',
    'iconPath',
    function socialIconStyle() {
      let iconBackgroundColor;
      let iconPath = this.get('iconPath');
      iconPath = iconPath || defaultIconPath;
      if (this.get('authId') === 'more') {
        iconBackgroundColor = '#fff';
      } else {
        iconBackgroundColor = this.get('iconBackgroundColor') || defaultIconBackgroundColor;
      }
      const fgColor = contrast(iconBackgroundColor) === 'light' ? darkFgColor : lightFgColor;
      const style = `background-image: url(${iconPath}); background-color: ${iconBackgroundColor}; color: ${fgColor};`;
      return htmlSafe(style);
    }),

  click() {
    this.get('action')(this.get('authId'));
  }
});
