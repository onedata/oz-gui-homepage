import Ember from 'ember';

/**
 * Renders single login button. Can optionally has a "link" property set to go
 * to a provided link instead of invoking action.
 * @module components/social-box
 * @author Jakub Liput
 * @copyright (C) 2016-2017 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */

const {
  computed,
  String: { htmlSafe },
} = Ember;

export default Ember.Component.extend({
  tagName: 'div',
  classNames: ['social-box-component'],
  classNameBindings: ['fullSize:full-size'],

  /**
   * Use oneicon (fonticon) or image placed in ``/assets/images/social/{type}.{iconType}``
   * @type {string} one of: oneicon, png, jpg, svg, <or other image format>
   */
  iconType: 'oneicon',

  /** Name of social/login service (eg. 'twitter') */
  type: null,

  /** Href for link when clicked */
  link: '',

  /**
   * If true, render icon without margin
   * @type {boolean}
   */
  fullSize: false,

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

  hasLink: function() {
    let link = this.get('link');
    return link && link.length !== 0;
  }.property('link'),

  actions: {
    clicked() {
      if (this.get('hasLink')) {
        window.location = this.get('link');
      } else {
        this.sendAction('action', this);
      }
    }
  }
});
