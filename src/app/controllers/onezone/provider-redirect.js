import Ember from 'ember';

const {
  inject: { service },
  computed: { readOnly },
} = Ember;

/**
 * Content of onezone application - a world map with providers.
 * @module routes/home/onezone/index
 * @author Jakub Liput
 * @copyright (C) 2016-2017 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Ember.Controller.extend({
  messageBox: service(),
  onezoneServer: service(),  
  
  /**
   * Stores error message if fetching provider URL failed
   * @type {string|null}
   */
  error: null,

  provider: readOnly('model'),
  
  goToFiles(providerId) {
    const p = this.get('onezoneServer').getProviderRedirectURL(providerId);
    p.then(
      (data) => {
        if (data.url) {
          window.location = data.url;
        } else {
          throw 'No provider URL in server response';
        }
      },
      (error) => {
        this.set('error', error);
      }
    );

    p.finally(() => this.set('goToIsLoading', false));
  },
});
