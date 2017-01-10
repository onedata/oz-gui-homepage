import Ember from 'ember';
import bindFloater from 'ember-cli-onedata-common/utils/bind-floater';

const {
  computed,
  inject,
  A,
  on,
  observer,
  run
} = Ember;

/**
 * Single space entry in spaces-accordion. Has a list of its providers.
 * @module components/spaces-accordion-item
 * @author Jakub Liput
 * @copyright (C) 2016 ACK CYFRONET AGH
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

  watchPrivilegesChanged: on('didInsertElement', observer('hasViewPrivilege', function() {
    run.schedule('afterRender',this,function() {
      if (this.get('hasViewPrivilege')) {
        this.prepareGetSupportTokenFloaters();
      }
    });
  })),

  prepareGetSupportTokenFloaters() {
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

  selectTokenText() {
    let input = this.$().find('input')[0];
    input.focus();
    input.setSelectionRange(0, input.value.length);
  },

  actions: {
    uncollapse() {
      this.$(`#${this.get('collapseId')}`).collapse('show');
    },

    openModal() {
      this.sendAction('openModal', ...arguments);
    },

    /**
     * If the support token is hidden, show it.
     * Then, regardless of dropdown state, fetch new.
     */
    showNewSupportToken() {
      let __getSupportTokenUpdatePosition = this.get('__getSupportTokenUpdatePosition');
      this.send('uncollapse');
      setTimeout(() => {
        let supportTokenOpened = this.get('supportTokenOpened');
        if (!supportTokenOpened) {
          this.set('supportTokenOpened', true);
        }
        setTimeout(__getSupportTokenUpdatePosition, 0);
        this.send('getNewSupportToken');
      }, 0);
    },

    getNewSupportToken() {
      let space = this.get('space');
      this.set('supportToken', null);
      if (space) {
        this.get('onezoneServer').getTokenProviderSupportSpace(space.get('id'))
          .then((data) => {
            const token = data.token;
            // TODO: only debug, should be removed in future
            console.debug('Fetched new support token: ' + token);
            this.set('supportToken', token);
          });
      } else {
        console.warn('Tried to get new support token, but no space is assigned to item');
      }
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
