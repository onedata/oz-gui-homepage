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
  messageBox: Ember.inject.service(),

  /**
   * Object with support mapping, eg. ``{plgrid: true, facebook: false}``
   * If authorizer is supported, its button will be displayed.
   * Allowed supporters: plgrid, dropbox, facebook, google, rhea
   *
   * Set by initSupportedAuthorizers
   */
  supportedAuthorizers: null,
  supportedAuthorizersCount: function() {
    const sa = this.get('supportedAuthorizers');
    return sa ? Object.keys(sa).length : 0;
  }.property('supportedAuthorizers'),

  /**
   * Class of the column containing all login buttons.
   * It should limit boxes, to not allow them to be spaced too much.
   */
  containerClass: Ember.computed('supportedAuthorizersCount', function() {
    const sac = this.get('supportedAuthorizersCount');
    let classes = 'col-xs-11 col-sm-7 col-centered';
    if (sac >= 8 ) {
      classes += ' col-md-7 col-lg-7';
    } else {
      classes += ' col-md-11 col-lg-11';
    }
    return classes;
  }),

  boxContainerClasses: function() {
    const sac = this.get('supportedAuthorizersCount');
    let classes = 'col-xs-6 col-sm-3 text-center sm-col-centered xs-two-col-center col-sm-last-1';
    if (sac === 7) {
      classes += ' col-1-of-7-md col-1-of-7-lg';
    } else if (sac >= 8) {
      classes += ' col-md-3';
      if (sac % 4 !== 0) {
        classes += ' col-centered';
      }
    } else if (sac % 6 === 0) {
      classes += ' col-md-2';
    } else {
      classes += ' col-md-2 col-centered';
    }
    return classes;
  }.property('supportedAuthorizersCount'),

  /** Fetches list of supported authorizers from server; sets supportedAuthorizers */
  initSupportedAuthorizers: function () {
    this.set('isLoading', true);
    const p = this.get('onezoneServer').getSupportedAuthorizers();
    p.then((data) => {
      this.set('supportedAuthorizers', data.authorizers);
    });

    p.catch(error => {
      const msg = error && error.message || this.get('i18n').t('components.socialBoxList.fetchProvidersFailedUnknown');
      this.set('errorMessage', msg);
    });

    p.finally(() => this.set('isLoading', false));
  }.on('init'),

  actions: {
    // TODO: what if there is server error?
    /** Get a login endpoint URL from server and go to it */
    authenticate(socialBox) {
      const providerName = socialBox.get('type');
      socialBox.set('active', true);
      const p = this.get('onezoneServer').getLoginEndpoint(providerName);
      p.then(
        (data) => {
          window.location = data.url;
        },
        (error) => {
          this.get('messageBox').open({
            title: this.get('i18n').t('components.socialBoxList.error.title'),
            message: this.get('i18n').t('components.socialBoxList.error.message') +
              (error.message ? ': ' + error.message : ''),
            type: 'error'
          });
        }
      );
      p.finally(() => {
        socialBox.set('active', false);
      });
    },

    showLoginForm() {
      this.set('loginFormOpened', true);
    }
  }
});
