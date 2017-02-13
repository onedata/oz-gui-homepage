import Ember from 'ember';

const QUERY_PARAMS = ['openid_invalid_request', 'new_account_email_occupied',
  'connect_account_email_occupied', 'connect_account_already_connected'];

const appController =  Ember.Controller.extend({
  messageBox: Ember.inject.service(),
  i18n: Ember.inject.service(),

  queryParams: QUERY_PARAMS,

  checkOpenIdError: function() {
    const i18n = this.get('i18n');
    const box = this.get('messageBox');
    const boxConfig = {
      title: i18n.t('application.openidErrors.title'),
      type: 'error',
      allowClose: true,
    };

    // TODO: now allowing to open multiple modals, but is it needed?
    // we have redundance here
    if (this.get('openidInvalidRequest')) {
      box.open(Object.assign(boxConfig, {
        message: i18n.t('application.openidErrors.openidInvalidRequest')
      }));
    }
    if (this.get('newAccountEmailOccupied')) {
      box.open(Object.assign(boxConfig, {
        message: i18n.t('application.openidErrors.newAccountEmailOccupied')
      }));
    }
    if (this.get('connectAccountEmailOccupied')) {
      box.open(Object.assign(boxConfig, {
        message: i18n.t('application.openidErrors.connectAccountEmailOccupied')
      }));
    }
    if (this.get('connectAccountAlreadyConnected')) {
      box.open(Object.assign(boxConfig, {
        message: i18n.t('application.openidErrors.connectAccountAlreadyConnected')
      }));
    }
  },

  resetQueryParams() {
    this.setProperties(
      // all query params to null
      QUERY_PARAMS.reduce((p, c) => { p[c] = null; return p; }, {})
    );
  }
});

const boolParamsExtension = {};

// create boolean property with camelCase names for all query params
QUERY_PARAMS.forEach(function(p) {
  boolParamsExtension[p.camelize()] =
    Ember.computed(p, function() {
      return this.get(p) === 'true';
    });
});

boolParamsExtension['watchQueryParams'] =
  Ember.observer(...QUERY_PARAMS, function() {
    this.checkOpenIdError();
  });

appController.reopen(boolParamsExtension);

export default appController;
