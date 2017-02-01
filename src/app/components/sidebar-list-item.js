import Ember from 'ember';

const {
  computed
} = Ember;

/**
 * An element to insert a item in sidebar's main accordion.
 * It can be plain list item or a button - see properties to customize.
 * 
 * TODO: currently the template is implemented like secondary-accordion
 * which is kind of hacky - simplify it!
 * 
 * @module components/sidebar-list-item
 * @author Jakub Liput
 * @copyright (C) 2017 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Ember.Component.extend({
  type: 'generic',

  /**
   * If true, override clickable, hoverable and hasBackground to behave
   * as a button.
   * @type {computed<boolean>}
   * @default false
   */
  isButton: false,

  clickable: false,
  hoverable: false,
  hasBackground: false,

  init() {
    this._super(...arguments);
    if (this.get('isButton')) {
      this.setProperties({
        clickable: true,
        hoverable: true,
        hasBackground: false,
      });
    }
  },

  accordionToggleClass: computed('type', 'clickable', function() {
    let {
      type, clickable, hoverable, hasBackground
    } = this.getProperties('type', 'clickable', 'hoverable', 'hasBackground');
    let cs = `accordion-toggle secondary-accordion-toggle ${type}-accordion-toggle`;
    if (clickable) {
      cs += ' clickable';
    }
    if (!hoverable) {
      cs += ' non-hoverable';
    }
    if (!hasBackground) {
      cs += ' no-background';
    }
    return cs;
  }),

});
