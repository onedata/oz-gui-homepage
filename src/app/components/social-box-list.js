import Ember from 'ember';

/**
 * Renders buttons for supported login providers. A container for social-boxes.
 * @module components/social-box-list
 * @author Jakub Liput
 * @copyright (C) 2016 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Ember.Component.extend({
  /**
   * List of authorizers
   * @type {Array.Object}
   */
  supportedAuthorizers: null,

  actions: {
    authenticate(socialBox) {
      const providerName = socialBox.get('type');
      socialBox.set('active', true);
      this.get('authenticate')(providerName).finally(() => {
        socialBox.set('active', false);
      });
    },
    usernameBoxClick() {
      this.get('onUsernameLoginClick')();
    },
  }
});
