import Ember from 'ember';

/**
 * Provides API for backend methods designed for Onezone.
 * Every API method returns a RVSP.Promise, which passes the error object on reject.
 * The error object have always a ``message`` property which is a string with a error description.
 * See methods documentation for information about parameters and the promise's ``resolve`` arguments.
 * @module services/onezone-server
 * @author Jakub Liput
 * @copyright (C) 2016 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Ember.Service.extend({
  server: Ember.inject.service(),

  /**
   *  Fetch list of supported authorizers (for login).
   *
   * @returns {RSVP.Promise} A backend operation completion:
   * - ``resolve(object: data)`` when successfully fetched authorizers list
   *   - ``data.authorizers`` (array<string>) An array with short auth. providers ids
   * - ``reject(object: error)`` on failure
   */
  getSupportedAuthorizers() {
    return this.get('server').publicRPC('getSupportedAuthorizers');
  },

  /**
   * Fetch token that can be used to add support for space in a provider.
   * Pass the token to provider, which will support the space
   *
   * @param {String} spaceId A ID of space that will gain support
   * @returns {RSVP.Promise} A backend operation completion:
   * - ``resolve(object: data)`` when successfully fetched the token
   *   - ``data.token`` (string)
   * - ``reject(object: error)`` on failure
   */
  getTokenProviderSupportSpace(spaceId) {
    return this.get('server').privateRPC('getTokenProviderSupportSpace', {
      spaceId: spaceId
    });
  },

  /**
   * Fetch a URL to provider.
   *
   * @param {String} providerId
   * @returns {RSVP.Promise} A backend operation completion:
   * - ``resolve(object: data)`` when successfully fetched the redirect URL
   *   - ``data.url`` (string)
   * - ``reject(object: error)`` on failure
   */
  getProviderRedirectURL(providerId) {
    return this.get('server').privateRPC('getProviderRedirectURL', {
      providerId: providerId
    });
  },

  /**
   * Fetch a URL to login endpoint.
   *
   * @param {String} providerName One of login providers, eg. google, dropbox
   * @returns {RSVP.Promise} A backend operation completion:
   * - ``resolve(object: data)`` when successfully fetched the endpoint
   *   - ``data.url`` (string)
   * - ``reject(object: error)`` on failure
   */
  getLoginEndpoint(providerName) {
    return this.get('server').publicRPC('getLoginEndpoint', {
      provider: providerName
    });
  },

  /**
   * Fetch URL to authenticator endpoint.
   *
   * @param {String} providerName A short name of auth provider, eg. "google"
   *  See login boxes for names of providers.
   * @returns {RSVP.Promise} A backend operation completion:
   * - ``resolve(object: data)`` when successfully fetched the URL
   *   - ``data.url`` (string)
   * - ``reject(object: error)`` on failure
   */
  getConnectAccountEndpoint(providerName) {
    return this.get('server').privateRPC('getConnectAccountEndpoint', {
      provider: providerName
    });
  },

  /**
   * Fetch the zone name.
   *
   * @returns {RSVP.Promise} A backend operation completion:
   * - ``resolve(object: data)`` when successfully fetched the zone name
   *   - ``data.zoneName`` (string)
   * - ``reject(object: error)`` on failure
   */
  getZoneName() {
    return this.get('server').publicRPC('getZoneName');
  },

  /**
   * Fetch user alias stored in backend.
   *
   * @returns {RSVP.Promise} A backend operation completion:
   * - ``resolve(object: data)`` when successfully fetched the alias
   *   - ``data.userAlias`` (string) - an alias
   * - ``reject(object: error)`` on failure
   */
  getUserAlias() {
    return this.get('server').privateRPC('getUserAlias');
  },

  /**
   * Set new user alias in backend.
   *
   * @param {String} userAlias A new user alias to set
   * @returns {RSVP.Promise} A backend operation completion:
   * - ``resolve(object: data)`` when successfully set new alias
   *   - ``data.userAlias`` (string) - an alias which was set (should be same as userAlias param)
   * - ``reject(object: error)`` on failure
   */
  setUserAlias(userAlias) {
    return this.get('server').privateRPC('setUserAlias', {
      userAlias: userAlias
    });
  },

  /**
   * The current user (session user) leaves a space.
   *
   * @param {String} spaceId An ID of the space to leave
   * @returns {RSVP.Promise} A backend operation completion:
   * - ``resolve()`` when successfully left the space
   * - ``reject(object: error)`` on failure
   */
  userLeaveSpace(spaceId) {
    return this.get('server').privateRPC('userLeaveSpace', {
      spaceId: spaceId
    });
  },

  /**
   * Change user password for login/password authentication method.
   *
   * @param {String} oldPassword Old (currently set) user password
   * @param {String} newPassword New password to set
   * @returns {RSVP.Promise} A backend operation completion:
   * - ``resolve()`` when successfully changed the password
   * - ``reject(object: error)`` on failure
   */
  changePassword(oldPassword, newPassword) {
    return this.get('server').privateRPC('changePassword', {
      oldPassword: oldPassword,
      newPassword: newPassword
    });
  },

  /**
   * Cease support of provider for space.
   *
   * @param {String} spaceId ID od Space, which will lost support
   * @param {String} providerId ID of Provider whose support will be ceased
   * @returns {RSVP.Promise} A backend operation completion:
   * - ``resolve()`` when successfully ceased the support
   * - ``reject(object: error)`` on failure
   */
  unsupportSpace(spaceId, providerId) {
    return this.get('server').privateRPC('unsupportSpace', {
      spaceId: spaceId,
      providerId: providerId
    });
  },

  /**
   * Use an invitation token to join a space for which the token was generated.
   *
   * @param {String} token A token generated with ``this.getTokenUserJoinSpace``
   * @returns {RSVP.Promise} A backend operation completion:
   * - ``resolve(object: data)`` when successfully joined to space
   *   - ``data.spaceId`` - ID of Space record that was joined to
   * - ``reject(object: error)`` on failure
   */
  store: Ember.inject.service(),
  userJoinSpace(token) {
    return this.get('server').privateRPC('userJoinSpace', {
      token: token
    });
  },
});
