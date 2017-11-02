import Ember from 'ember';
import ConflictIdsArray from 'ember-cli-onedata-common/utils/conflict-ids-array';
import AuthenticationErrorHandlerMixin from 'oz-worker-gui/mixins/authentication-error-handler';

const {
  String: {
    camelize,
    classify
  },
  inject,
  computed,
  run: {
    schedule
  },
  observer,
  RSVP: { Promise },
} = Ember;

const ObjectPromiseProxy = Ember.ObjectProxy.extend(Ember.PromiseProxyMixin);

const SIDEBAR_GROUPS = [
  'accounts', 'spaces', 'providers',
  'tokens', 'alias', 'groups'
];

const EXPAND_PARAMS = SIDEBAR_GROUPS.map(name => `expand_${name}`);

/**
 * Controller used mainly for reading query params for expanding particular accordions.
 * See queryParams property.
 * @module controllers/onezone
 * @author Jakub Liput
 * @copyright (C) 2016-2017 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
const controller = Ember.Controller.extend(
  AuthenticationErrorHandlerMixin,
  {
    
    modalsManager: inject.service(),
    onezoneSidebar: inject.service(),
    session: inject.service(),
    onezoneServer: inject.service(),

    modal: computed.alias('modalsManager.currentModal'),

    user: computed.readOnly('model'),

    init: function () {
      this._super();
      schedule('afterRender',this,function() {
        this.send('expandQuerySpecifiedAccordions');
      });
    },

    modalInfo: Object.create({
      name: null,
      resolve: null,
      reject: null,
    }),

    __providersDidExpand: false,

    expandProvidersInSidebar: observer('model.providers.{isFulfilled,length}', function() {
      let providers = this.get('model.providers');
      if (!this.get('__providersDidExpand') && providers.get('isFulfilled') && providers.get('length') > 0) {
        this.set('__providersDidExpand', true);
        schedule('afterRender', this, function() {
          this.get('onezoneSidebar').expandMain('providers');
        });      
      }
    }),

    serviceVersion: computed.readOnly('session.sessionDetails.serviceVersion'),
    __serviceNameProxy: computed('onezoneServer', function () {
      let promise = new Promise((resolve, reject) => {
        this.get('onezoneServer').getZoneName().then(
          ({ zoneName }) => resolve(zoneName),
          () => reject(...arguments)
        );
      });
      return ObjectPromiseProxy.create({ promise });
    }),
    serviceName: computed.readOnly('__serviceNameProxy.content'),

    actions: {
      openModal() {
        this.get('modalsManager').openModal(...arguments);
      },
      closeModal() {
        this.get('modalsManager').closeModal(...arguments);
      }
    },
});

// Adds query params and 

let expandMixin = {
  queryParams: EXPAND_PARAMS,
  actions: {}
};

EXPAND_PARAMS.forEach(function(prop) {
  expandMixin[camelize(prop)] = computed(prop, function() {
    return this.get(prop) === 'true';
  });
});

expandMixin.actions['expandQuerySpecifiedAccordions'] = function() {
  SIDEBAR_GROUPS.forEach(prop => {
    if (this.get('expand' + classify(prop))) {
      this.get('onezoneSidebar').expandMain(prop);
    }
  });
};

controller.reopen(expandMixin);

let collectionsProxyMixin = {};
['spaces', 'groups', 'providers'].forEach(collection => {
  collectionsProxyMixin[collection] = computed(`user.${collection}`, function () {
    return ConflictIdsArray.create({ content: this.get(`user.${collection}`) });
  });
});
controller.reopen(collectionsProxyMixin);

export default controller;
