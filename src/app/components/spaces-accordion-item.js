import Ember from 'ember';

const {
  computed,
  inject,
  A,
} = Ember;

/**
 * Single space entry in spaces-accordion. Has a list of its providers.
 * @module components/spaces-accordion-item
 * @author Jakub Liput
 * @copyright (C) 2016-2017 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Ember.Component.extend({
  store: inject.service(),
  onezoneServer: inject.service(),
  notify: inject.service(),
  spacesManager: inject.service(),

  /** Space model - should be injected */
  space: null,

  hasViewPrivilege: computed.alias('space.hasViewPrivilege'),
  showProviders: computed.alias('hasViewPrivilege'),

  /**
   * Toggles support token dropdown visibility (two-way).
   * @type {boolean}
   * @private
   */
  supportTokenOpened: false,

  providers: computed('showProviders', 'space.providers', function() {
    if (this.get('space.hasViewPrivilege')) {
      return this.get('space.providers');
    } else {
      return A();
    }
  }),

  providersSorting: ['isDefault:desc', 'name'],
  providersSorted: computed.sort('providers', 'providersSorting'),

  classNames: ['secondary-accordion-item', 'spaces-accordion-item'],

  supportToken: null,

  collapseId: computed('space.id', function() {
    let spaceId = this.get('space.id');
    return spaceId ? `collapse-space-${this.get('space.id')}` : undefined;
  }),

  init() {
    this._super(...arguments);
  },

  actions: {
    uncollapse() {
      this.$(`#${this.get('collapseId')}`).collapse('show');
    },

    openModal() {
      this.sendAction('openModal', ...arguments);
    },

    showSupportModal() {
      this.send('openModal', 'addSpaceStorage', {
        space: this.get('space'),
      });
    },

    /** Set the space as default, unsetting other spaces */
    toggleDefault() {
      let { spacesManager, space } =
        this.getProperties('spacesManager', 'space');

      spacesManager.toggleSpaceAsDefault(space);
    },
    
    goToProvider(provider) {
      this.get('space.providers').forEach((p) => p.set('isSelected', false));
      provider.set('isSelected', true);
    },

    showUnsupportSpaceModal(provider) {
      this.sendAction('showUnsupportSpaceModal', this.get('space'), provider);
    }
  }
});
