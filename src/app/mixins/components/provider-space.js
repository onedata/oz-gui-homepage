import Ember from 'ember';

/**
 * A base to build a component that shows info about space in context of particular provider.
 * @module mixins/components/providers-space
 * @author Jakub Liput
 * @copyright (C) 2016 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Ember.Mixin.create({
  tagName: 'li',

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

  iconName: Ember.computed('space.isDefault', function() {
    return this.get('space.isDefault') ? 'space-default' : 'space';
  }),

  supportSize: Ember.computed('space.supportSizes', 'providerId', function() {
    let supportSizes = this.get('space.supportSizes');
    let providerId = this.get('providerId');
    return supportSizes[providerId];
  }),
});
