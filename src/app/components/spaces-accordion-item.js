import Ember from 'ember';
import bindFloater from 'ember-cli-onedata-common/utils/bind-floater';

/**
 * Single space entry in spaces-accordion. Has a list of its providers.
 * @module components/spaces-accordion-item
 * @author Jakub Liput
 * @copyright (C) 2016 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Ember.Component.extend({
  store: Ember.inject.service(),
  onezoneServer: Ember.inject.service(),
  notify: Ember.inject.service(),

  /** Space model - should be injected */
  space: null,

  hasViewPrivilege: Ember.computed.alias('space.hasViewPrivilege'),
  showProviders: Ember.computed.alias('hasViewPrivilege'),

  providers: Ember.computed('showProviders', 'space.providers', function() {
    if (this.get('space.hasViewPrivilege')) {
      return this.get('space.providers');
    } else {
      return Ember.A();
    }
  }),

  providersSorting: ['isDefault:desc', 'name'],
  providersSorted: Ember.computed.sort('providers', 'providersSorting'),

  classNames: ['secondary-accordion-item', 'spaces-accordion-item'],

  supportToken: null,

  collapseId: Ember.computed('space.id', function() {
    let spaceId = this.get('space.id');
    return spaceId ? `collapse-space-${this.get('space.id')}` : undefined;
  }),

  init() {
    this._super(...arguments);
  },

  watchPrivilegesChanged: Ember.on('didInsertElement', Ember.observer('hasViewPrivilege', function() {
    Ember.run.schedule('afterRender',this,function() {
      if (this.get('hasViewPrivilege')) {
        this.prepareGetSupportTokenFloaters();
      }
    });
  })),

  prepareGetSupportTokenFloaters() {
    this.$().find('.floater').each(function() {
      let ft = $(this);
      let updatePosition = bindFloater(ft);
      ft.parent().on('mouseover', updatePosition);
      // TODO: performance - better all updatePositions in one fun
      $('.accordion-container').on('scroll', updatePosition);
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

    // TODO: this action should not be invoked when there is currently opened other token
    getNewSupportToken() {
      this.send('uncollapse');
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
      let store = this.get('store');
      // TODO: use query?
      // there should be only one default provider, but for safety...
      let defaultSpaces = store.peekAll('space').filterBy('isDefault', true);
      defaultSpaces.toArray().forEach((p) => {
        p.set('isDefault', false);
        p.save();
      });

      let space = this.get('space');
      space.set('isDefault', true);
      space.save();
    },
    // TODO: a notification for user
    copySuccess() {
      this.selectTokenText();
      this.get('notify').info(this.get('i18n').t('common.notify.clipboardSuccess'));
    },
    // TODO: a notification for user
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
