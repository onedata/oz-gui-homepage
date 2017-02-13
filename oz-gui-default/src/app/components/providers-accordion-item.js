import Ember from 'ember';
import bindFloater from 'ember-cli-onedata-common/utils/bind-floater';
import safeElementId from 'ember-cli-onedata-common/utils/safe-element-id';

const {
  inject,
  computed
} = Ember;

/**
 * Provider entry in sidebar. Contains list of its spaces.
 * @module components/providers-accordion-item
 * @author Jakub Liput
 * @copyright (C) 2016-2017 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Ember.Component.extend({
  store: inject.service(),
  onezoneServer: inject.service(),
  providersManager: inject.service(),


  /** Provider model to display - should be injected */
  provider: null,

  spaces: computed('provider.spaces', function() {
    return this.get('provider.spaces');
  }),
  spacesSorting: ['isDefault:desc', 'name'],
  spacesSorted: computed.sort('spaces', 'spacesSorting'),

  collapseId: function() {
    return safeElementId(`collapse-provider-${this.get('provider.id')}`);
  }.property('provider', 'provider.id'),

  iconName: function() {
    let provider = this.get('provider');
    return (provider && provider.get('isDefault')) ? 'provider-home' : 'provider';
  }.property('provider.isDefault'),

  iconColorClass: function() {
    let provider = this.get('provider');
    return (provider && provider.get('isWorking')) ? 'color-provider-working' : 'color-provider-not-working';
  }.property('provider.isWorking'),

  classNames: ['secondary-accordion-item', 'providers-accordion-item'],

  didInsertElement() {
    this.$().find('.floater').each(function() {
      let ft = $(this);
      let updatePosition = bindFloater(ft);
      ft.parent().on('mouseover', updatePosition);
      // TODO: performance - better all updatePositions in one fun
      $('.accordion-container').on('scroll', updatePosition);
    });
  },

  actions: {
    /** Currently set its provider selection */
    goToProvider() {
      let provider = this.get('provider');
      this.sendAction('selectProvider', provider);
    },

    /** Set or unset the provider as default (can unset other providers) */
    toggleDefault() {
      let { providersManager, provider } =
        this.getProperties('providersManager', 'provider');

      providersManager.toggleProviderAsDefault(provider);
    }
  }
});
