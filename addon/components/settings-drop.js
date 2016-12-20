import Ember from 'ember';
import bindFloater from 'ember-cli-onedata-common/utils/bind-floater';
import layout from '../templates/components/settings-drop';

/**
 * Common functions for settings-drop components (space-settings-drop, group-settings-drop, etc.)
 * Specific setting-drops should implement ``menuItems`` property and actions for them.
 * 
 * @module mixins/components/settings-drop
 * @author Jakub Liput
 * @copyright (C) 2016 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Ember.Component.extend({
  classNames: ['item-element', 'item-icon'],

  layout,

  /**
   * @typedef {Object} SettingsDropMenuItem
   * @property {String} icon name of one-icon
   * @property {String} label translated label
   * @property {String} action name of action to invoke on settings-drop on click
   */

  /**
   * @type {SettingsDropMenuItem[]}
   * @abstract
   * @public
   * @required
   */
  menuItems: null,

  /**
   * Eg. "space" or "group"
   * @type {String}
   * @abstract
   * @public
   */
  type: 'generic',

  // TODO: deregister event from sidebar on willDestroyElement
  // maybe use: this.on('willDestroyElement', () => { sidebar.off(...) } ) etc.
  didInsertElement() {
    // FIXME: wrong fixed element for updater (only for OP)
    let sidebar = $('.secondary-sidebar');
    let drop = this.$().find('.dropdown-menu');
    let updater = bindFloater(drop, null, {
      offsetX: 8
    });
    sidebar.on('scroll', updater);
    drop.on('mouseover', updater);
    updater();
  },
});
