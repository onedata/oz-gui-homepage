import Ember from 'ember';
import PromiseObject from 'ember-cli-onedata-common/utils/ember/promise-object';

const {
  Service,
  inject: { service },
  computed,
  get,
} = Ember;

export default Service.extend({
  onezoneServer: service(),
  
  /**
   * @type {boolean}
   */
  lastTestModeValue: false,

  /**
   * @type {PromiseObject}
   */
  supportedAuthorizersProxy: computed(function supportedAuthorizers() {
    return PromiseObject.create({
      promise: this.get('onezoneServer').getSupportedAuthorizers(false),
    });
  }),
  
  getSupportedAuthorizers(testMode = false) {
    if (this.get('lastTestModeValue') !== testMode) {
      const supportedAuthorizersProxy = PromiseObject.create({
        promise: this.get('onezoneServer').getSupportedAuthorizers(testMode),
      });
      this.setProperties({
        lastTestModeValue: testMode,
        supportedAuthorizersProxy,
      });
      return get(supportedAuthorizersProxy, 'promise');
    } else {
      return this.get('supportedAuthorizersProxy.promise');
    }
  },
});
