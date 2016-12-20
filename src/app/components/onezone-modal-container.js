import Ember from 'ember';
import bindFloater from 'ember-cli-onedata-common/utils/bind-floater';

// TODO: tests please, because it was a draft; integrate with atlas
/**
 * Conditionally displays a message for user instead of providers world map.
 * @module components/onezone-modal-container
 * @author Jakub Liput
 * @copyright (C) 2016 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Ember.Component.extend({
  session: Ember.inject.service('session'),

  classNames: ['onezone-modal-container'],

  /** Should be injected */
  providers: null,

  isLoading: Ember.computed.alias('providers.isUpdating'),

  isLoadingChanged: function() {
    if (this.get('isLoading')) {
      const updater = bindFloater($('.onezone-modal-container .spinner-container'), $('.onezone-atlas'), {
        posX: 'center',
        posY: 'middle-middle'
      });
      $('.onezone-atlas').on('mouseover', updater);
      $('.onezone-atlas').on('scroll', updater);

      // a HACK to update loader position after atlas resize...
      setTimeout(function () {
        updater();
      }, 100);
    }
  }.observes('isLoading'),

  isFirstLogin: function () {
    let sessionDetails = this.get('session').get('sessionDetails');
    return sessionDetails && sessionDetails.firstLogin;
  }.property('session.sessionDetails'),

  modalFirstLogin: function () {
    return this.get('isFirstLogin') &&
      (!this.get('providers') || this.get('providers.length') === 0);
  }.property('isFirstLogin', 'providers', 'providers.length'),

  modalGetSupport: function () {
    return !this.get('providers') ||
      this.get('providers.length') === 0;
  }.property('providers', 'providers.length'),

  /** If true, show "none providers" modal */
  modalNoneProviders: function () {
    return this.get('providers.length') > 0 &&
      this.get('providers').filterBy('isWorking', true).length === 0;
  }.property('providers.@each.isWorking'),

  didInsertElement() {
    this.isLoadingChanged();
  }

});
