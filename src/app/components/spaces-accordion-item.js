import Ember from 'ember';
import bindFloater from 'ember-cli-onedata-common/utils/bind-floater';

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
  
  didInsertElement() {
    this.prepareFloaters();
  },

  prepareFloaters() {
    let self = this;  
    this.$().find('.floater').each(function() {
      let ft = $(this);
      let updatePosition = bindFloater(ft);
      ft.parent().on('mouseover', updatePosition);
      // TODO: performance - better all updatePositions in one fun
      $('.accordion-container').on('scroll', updatePosition);

      if (ft.hasClass('token-popup')) {
        self.set('__getSupportTokenUpdatePosition', updatePosition);
      }
    });

    // prevent space token popup close on input and button click
    $(document).on('click', `#${this.get('elementId')} .input-with-button`, function (e) {
      e.stopPropagation();
    });
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
    
    copySuccess() {
      this.selectTokenText();
      this.get('notify').info(this.get('i18n').t('common.notify.clipboardSuccess'));
    },
    
    copyError() {
      this.selectTokenText();
      this.get('notify').warn(this.get('i18n').t('common.notify.clipboardFailure'));
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
