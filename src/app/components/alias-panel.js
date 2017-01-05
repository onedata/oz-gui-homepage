import Ember from 'ember';
import PromiseLoadingMixin from 'ember-cli-onedata-common/mixins/promise-loading';

/**
 * One of main sidebar items: allows to change alias.
 * @module components/alias-panel
 * @author Jakub Liput
 * @copyright (C) 2016 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Ember.Component.extend(PromiseLoadingMixin, {
  store: Ember.inject.service(),
  session: Ember.inject.service(),
  messageBox: Ember.inject.service(),
  i18n: Ember.inject.service(),

  classNames: ['secondary-accordion', 'alias-panel', 'accordion-content'],
  classNameBindings: ['isLoading:sidebar-item-is-loading'],

  /** To inject.
   * @public
   * @type {User}
   */
  user: null,

  isLoading: false,

  /** Returns true if aliasText is not blank - used for showing no alias message otherwise */
  correctAlias: function() {
    return !!this.get('aliasText');
  }.property('aliasText'),

  /** Client-side known alias */
  aliasText: Ember.computed.alias('session.user.alias'),

  /** Client-side temporary value of alias edit field */
  aliasTextEdit: null,

  /** True if in alias edit mode (shows alias edit) */
  aliasEditing: false,

  toggleClass: Ember.computed('isLoading', function() {
    let isLoading = this.get('isLoading');
    return isLoading ? 'non-hoverable' : 'clickable';
  }),

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
      let user = this.get('session.user');
      user.set('alias', aliasName);
      let userSavePromise = user.save();
      userSavePromise.then(() => {
        console.debug('Set alias successful');
      });
      userSavePromise.catch(error => {
          this.get('messageBox').open({
            title: this.get('i18n').t('common.serverError'),
            message: this.get('i18n').t('components.aliasPanel.setAliasFailed') +
              (error.message ? ': ' + error.message : ''),
            type: 'warning'
          });
        }
      );
      userSavePromise.finally(() => {
        this.setProperties({
          aliasEditing: false,
          isLoading: false
        });
      });
    }
  }
});
