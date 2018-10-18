import Ember from 'ember';
import PromiseObject from 'ember-cli-onedata-common/utils/ember/promise-object';

const {
  Service,
  inject: { service },
  computed,
} = Ember;

export default Service.extend({
  onezoneServer: service(),
  
  supportedAuthorizersProxy: computed(function supportedAuthorizers() {
    return PromiseObject.create({
      promise: this.get('onezoneServer').getSupportedAuthorizers(),
    });
  }),
  
  getSupportedAuthorizers() {
    return this.get('supportedAuthorizersProxy.promise');
  },
});
