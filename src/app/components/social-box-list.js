import Ember from 'ember';

/**
 * Renders buttons for supported login providers. A container for social-boxes.
 * @module components/social-box-list
 * @author Jakub Liput
 * @copyright (C) 2016 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Ember.Component.extend({
  onezoneServer: Ember.inject.service(),

  /**
   * Object with support mapping, eg. ``{plgrid: true, facebook: false}``
   * If authorizer is supported, its button will be displayed.
   * Allowed supporters: plgrid, dropbox, facebook, google
   *
   * Set by initSupportedAuthorizers
   */
  supportedAuthorizers: null,
  supportedAuthorizersCount: function() {
    const sa = this.get('supportedAuthorizers');
    return sa ? Object.keys(sa).length : 0;
  }.property('supportedAuthorizers'),

  boxContainerClasses: function() {
    const sac = this.get('supportedAuthorizersCount');
    let classes = 'col-xs-6 col-sm-3 sm-text-center sm-col-centered xs-two-col-center col-sm-last-1';
    if (sac > 6) {
      classes += ' col-1-of-7-md col-1-of-7-lg';
    } else if (sac % 6 === 0) {
      classes += ' col-2-md';
    } else {
      classes += ' col-2-md col-centered';
    }
    return classes;
  }.property('supportedAuthorizersCount'),

  /** Fetches list of supported authorizers from server; sets supportedAuthorizers */
  initSupportedAuthorizers: function () {
    this.get('onezoneServer').getSupportedAuthorizers().then((data) => {
      const authorizersList = data.authorizers;
      let authorizers = {};
      authorizersList.forEach((authorizerId) => {
        authorizers[authorizerId] = true;
      });

      // FIXME: mocked username authorizer
      authorizers['username'] = true;

      // FIXME: mocked indigo authorizer
      authorizers['indigo'] = true;

      this.set('supportedAuthorizers', authorizers);
    });
  }.on('init'),

  actions: {
    // TODO: what if there is server error?
    /** Get a login endpoint URL from server and go to it */
    authenticate(providerName) {
      this.$().find(`.login-icon-box.${providerName}`).addClass('active');
      this.get('onezoneServer').getLoginEndpoint(providerName).then(
        (data) => {
          window.location = data.url;
        },
        (error) => {
          // TODO: use modal instead of window.alert
          window.alert('Getting authentication endpoint failed: ' + error);
          this.$().find(`.login-icon-box.${providerName}`).removeClass('active');
        }
      );
    },

    showLoginForm() {
      this.set('loginFormOpened', true);
    }
  }
});
