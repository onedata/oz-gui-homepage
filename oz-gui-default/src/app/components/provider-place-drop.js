import Ember from 'ember';
import bindFloater from 'ember-cli-onedata-common/utils/bind-floater';

/**
 * A popup (drop) with fixed position placed near to the provider-place widget,
 * visible when clicked. Contains information about provider and its spaces.
 * Fixed position automatically updates on some events, like atlas resize.
 * @module components/provider-place-drop
 * @author Jakub Liput
 * @copyright (C) 2016 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Ember.Component.extend({
  onezoneServer: Ember.inject.service(),
  messageBox: Ember.inject.service(),
  notify: Ember.inject.service(),
  
  classNames: ['provider-place-drop'],
  classNameBindings: ['isWorking', 'dropSide'],
  
  isWorking: Ember.computed('provider.isWorking', function() {
    return this.get('provider.isWorking') ? 'working' : '';
  }),

  /**
   * To inject.
   * Parent component
   * @required
   * @type {ProviderPlaceComponent}
   */
  providerPlace: null,

  provider: Ember.computed.readOnly('providerPlace.provider'),

  spaces: Ember.computed.readOnly('provider.spaces'),

  spacesSorting: ['isDefault:desc', 'name'],
  spacesSorted: Ember.computed.sort('spaces', 'spacesSorting'),

  /**
   * If true, places provider drop on the left of provider place circle
   * @type {Ember.computed<Boolean>} 
   */
  dropSideLeft: Ember.computed('provider.longitude', function() {
    return this.get('provider.longitude') >= 0;
  }),

  /**
   * Returns a class name
   * @type {Ember.computed<String>}
   */
  dropSide: Ember.computed('dropSideLeft', function() {
    return this.get('dropSideLeft') ? 'drop-left' : 'drop-right';
  }),

  clipboardTarget: Ember.computed('elementId', function() {
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

  click(event) {
    event.preventDefault();
    return false;
  },

  actions: {
    goToFiles() {
      const p = this.get('onezoneServer').getProviderRedirectURL(this.get('provider.id'));
      p.then(
        (data) => {
          window.location = data.url;
        },
        (error) => {
          this.get('messageBox').open({
            title: this.get('i18n').t('common.serverError'),
            message: this.get('i18n').t('onezone.providerPlaceDrop.goToFilesErrorMessage') +
              ((error && error.message) ? (': ' + error.message) : ''),
            type: 'error'
          });
        }
      );

      p.finally(() => this.set('goToIsLoading', false));
    },

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
