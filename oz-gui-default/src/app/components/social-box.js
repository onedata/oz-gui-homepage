import Ember from 'ember';
import contrast from 'npm:contrast';
import {
  defaultIconBackgroundColor,
  defaultIconPath,
  darkFgColor,
  lightFgColor,
} from 'oz-worker-gui/utils/auth-box-config';

/**
 * Renders single login button. Can optionally has a "link" property set to go
 * to a provided link instead of invoking action.
 * @module components/social-box
 * @author Jakub Liput
 * @copyright (C) 2016-2018 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */

const {
  computed,
  String: { htmlSafe },
} = Ember;

export default Ember.Component.extend({
  tagName: 'div',
  classNames: ['social-box-component'],

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
  iconPath: undefined,

  /**
   * @virtual
   * @type {string}
   */
  iconBackgroundColor: undefined,

  /**
   * @virtual
   * Text for tooltip
   * @type {string}
   */
  tip: '',

  /**
   * @virtual
   * URL to go when clicked
   * @type {string}
   */
  link: '',

  /**
   * Spinner scale
   * @type {number}
   */
  spinnerScale: 0.25,

  authIdClass: computed('authId', function authIdClass() {
    let authId = this.get('authId');
    if (authId) {
      return 'idp-' + authId.replace(/ /g, '-');
    } else {
      return '';
    }
  }),
  
  /**
   * @type {Ember.ComputedProperty<string>}
   */
  socialIconStyle: computed(
    'authId',
    'iconPath',
    function socialIconStyle() {
      if (this.get('authId') === 'more') {
        return htmlSafe('');
      } else {
        let iconPath = this.get('iconPath');
        iconPath = iconPath || defaultIconPath;
        iconPath = iconPath.replace(/"/g, '\\"');
        const style = `background-image: url("${iconPath}");`;
        return htmlSafe(style);
      }
    }),

  /**
   * @type {Ember.ComputedProperty<string>}
   */
  aStyle: computed(
    'iconBackgroundColor',
    function aStyle() {
      let iconBackgroundColor;
      if (this.get('authId') === 'more') {
        iconBackgroundColor = '#fff';
      } else {
        iconBackgroundColor = this.get('iconBackgroundColor') || defaultIconBackgroundColor;
      }
      let fgColor = contrast(iconBackgroundColor) === 'light' ? darkFgColor : lightFgColor;
      iconBackgroundColor = iconBackgroundColor.replace(/;/g, '\\;');
      fgColor = fgColor.replace(/;/g, '\\;');
      const style = `background-color: ${iconBackgroundColor}; color: ${fgColor};`;
      return htmlSafe(style);
    }),

  hasLink: computed('link', function hasLink() {
    let link = this.get('link');
    return link && link.length !== 0;
  }),

  click() {
    // hide tooltip
    this.$().trigger('mouseout');
  },

  actions: {
    clicked() {
      if (!this.get('disabled')) {
        if (this.get('hasLink')) {
          window.location = this.get('link');
        } else {
          this.get('action')(this);
        }
      }
    }
  }
});
