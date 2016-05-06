import Ember from 'ember';
import { expect } from 'chai';
import {
  describeComponent,
  it
} from 'ember-mocha';

describeComponent(
  'account-add',
  'AccountAddComponent',
  {
    // Specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar'],
    unit: true
  },
  function() {
    it('sets isLoading to true until authProviders are fetched ', function () {
      let ServerCls = Ember.Object.extend({
        getSupportedAuthorizers() {
          return new Ember.RSVP.Promise((/*resolve, reject*/) => {
            // do not resolve nor reject - the promise will be forever
          });
        }
      });

      let onezoneServer = new ServerCls();

      let component = this.subject({
        onezoneServer: onezoneServer
      });

      expect(component.get('isLoading')).to.equal(true);
    });

    it('sets isLoading to false when authProviders are fetched ', function (done) {
      let isServerResolved = false;

      let ServerCls = Ember.Object.extend({
        getSupportedAuthorizers() {
          let promise = new Ember.RSVP.Promise((resolve/*, reject*/) => {
            resolve([]);
          });
          promise.finally(() => {
            isServerResolved = true;
          });
          return promise;
        }
      });

      let onezoneServer = new ServerCls();

      let component = this.subject({
        onezoneServer: onezoneServer
      });

      component.addObserver('isLoading', () => {
        if (isServerResolved) {
          expect(component.get('isLoading')).to.equal(false);
          done();
        }
      });

    });
  }
);
