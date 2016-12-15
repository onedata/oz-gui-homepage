import Ember from 'ember';

/**
 * A list entry for single space in context of particular provider
 * in provider-place-drop.
 * 
 * Styles are in ``provider-place-drop`` SCSS file.
 * 
 * @module components/provider-place-drop-space
 * @author Jakub Liput
 * @copyright (C) 2016 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Ember.Component.extend({
  onezoneServer: Ember.inject.service(),
  messageBox: Ember.inject.service(),
  notify: Ember.inject.service(),
  
  tagName: 'li',
  classNames: ['provider-place-drop-space'],
  
  /**
   * To inject.
   * @type {String}
   * @required
   */
  providerId: null,

  /**
   * To inject.
   * @type {Space}
   * @required
   */
  space: null,

  name: Ember.computed.alias('space.name'),

  supportSize: Ember.computed('space.supportSizes', 'providerId', function() {
    let supportSizes = this.get('space.supportSizes');
    let providerId = this.get('providerId');
    return supportSizes[providerId];
  }),
  
  iconName: Ember.computed('space.isDefault', function() {
    return this.get('space.isDefault') ? 'space-default' : 'space';
  })
});
