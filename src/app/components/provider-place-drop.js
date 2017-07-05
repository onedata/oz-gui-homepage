import Ember from 'ember';
import bindFloater from 'ember-cli-onedata-common/utils/bind-floater';

const {
  Component,
  computed,
  inject
} = Ember;

/**
 * A popup (drop) with fixed position placed near to the provider-place widget,
 * visible when clicked. Contains information about provider and its spaces.
 * Fixed position automatically updates on some events, like atlas resize.
 * @module components/provider-place-drop
 * @author Jakub Liput
 * @copyright (C) 2016 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Component.extend({
  onezoneServer: inject.service(),
  messageBox: inject.service(),
  notify: inject.service(),
  
  classNames: ['provider-place-drop'],
  classNameBindings: ['status', 'dropSide'],
  
  status: computed('provider.status', function() {
    let provider = this.get('provider');
    return provider.get('isStatusValid') ? provider.get('status') : 'pending';
  }),

  /**
   * To inject.
   * Parent component
   * @required
   * @type {ProviderPlaceComponent}
   */
  providerPlace: null,

  provider: computed.readOnly('providerPlace.provider'),

  spaces: computed.readOnly('provider.spaces'),

  spacesSorting: ['isDefault:desc', 'name'],
  spacesSorted: computed.sort('spaces', 'spacesSorting'),

  /**
   * If true, places provider drop on the left of provider place circle
   * @type {computed<Boolean>} 
   */
  dropSideLeft: computed('provider.longitude', function() {
    return this.get('provider.longitude') >= 0;
  }),

  /**
   * Returns a class name
   * @type {computed<String>}
   */
  dropSide: computed('dropSideLeft', function() {
    return this.get('dropSideLeft') ? 'drop-left' : 'drop-right';
  }),

  clipboardTarget: computed('elementId', function() {
    let elementId = this.get('elementId');
    return `#${elementId} input`;
  }),

  /** Binds a fixed position update event */
  didInsertElement() {
    let popup = this.$();
    let updater = bindFloater(popup, null, {
      posX: (this.get('dropSideLeft') ? 'left' : 'right'),
      posY: 'middle-middle',
      // a margin
      offsetX: 16 * (this.get('dropSideLeft') ? -1 : 1),
    });
    this.$().on('mouseover', updater);
    this.$().parent().on('mouseover', updater);
    $(window).resize(updater);
    $(window).scroll(updater);
  },

  /**
   * @param {Event} event 
   */
  click(event) {
    event.stopPropagation();
  },

  actions: {
    copySuccess() {
      let {i18n, notify} = this.getProperties('i18n', 'notify');
      notify.info(i18n.t('onezone.providerPlaceDrop.hostnameCopySuccess'));
    },

    copyError() {
      let {i18n, notify} = this.getProperties('i18n', 'notify');
      notify.info(i18n.t('onezone.providerPlaceDrop.hostnameCopyError'));
    }
  }
});
