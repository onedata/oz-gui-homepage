import ApplicationSerializer from './application';
import EmbeddedRecordsMixin from 'ember-data/serializers/embedded-records-mixin';

export default ApplicationSerializer.extend(EmbeddedRecordsMixin, {
  attrs: {
    clienttokens: { embedded: 'always' },
    authorizers: { embedded: 'always' }
  }
});
