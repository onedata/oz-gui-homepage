import Ember from 'ember';
import PromiseLoadingMixin from '../mixins/promise-loading';

/**
 * One of main sidebar items: allows to change alias.
 * @module components/alias-panel
 * @author Jakub Liput
 * @copyright (C) 2016 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Ember.Component.extend(PromiseLoadingMixin, {
  store: Ember.inject.service(),
  onezoneServer: Ember.inject.service(),

  classNames: ['secondary-accordion', 'alias-panel', 'accordion-content'],
  classNameBindings: ['isLoading:sidebar-item-is-loading'],

  isLoading: false,

  /** Returns true if aliasText is not blank - used for showing no alias message otherwise */
  correctAlias: function() {
    return !!this.get('aliasText');
  }.property('aliasText'),

  /** Client-side known alias */
  aliasText: null,

  /** Client-side temporary value of alias edit field */
  aliasTextEdit: null,

  /** True if in alias edit mode (shows alias edit) */
  aliasEditing: false,

  /** Fetch alias from server on init - sets aliasText */
  updateAliasText: function() {
    this.promiseLoading(this.get('onezoneServer').getUserAlias()).then(
      (alias) => {
        this.set('aliasText', alias);
      },
      (error) => {
        window.alert('Getting alias failed: ' + error);
      }
    );
  }.on('init'),

  actions: {
    startEditAlias: function() {
      if (!this.get('aliasEditing')) {
        this.set('aliasTextEdit', this.get('aliasText'));
        this.set('aliasEditing', true);
      }
    },

    // TODO: this should be invoked when pressing Esc when in editing mode
    // TODO: maybe create a global object, in which any cancel action can be registered
    // TODO: eg. service('cancel').register(fun);

    cancelEditAlias: function() {
      if (this.get('aliasEditing')) {
        this.set('aliasEditing', false);
      }
    },

    endEditAlias: function(aliasName) {
      this.set('isLoading', true);
      let setAliasPromise = this.get('onezoneServer').setUserAlias(aliasName);
      setAliasPromise.then(
        (newAlias) => {
          this.set('aliasText', newAlias);
          console.debug('Set alias successful');
        },
        (error) => {
          window.alert('Set alias failed: ' + error.message);
        }
      );
      setAliasPromise.finally(() => {
        this.setProperties({
          aliasEditing: false,
          isLoading: false
        });
      });
    }
  }
});
