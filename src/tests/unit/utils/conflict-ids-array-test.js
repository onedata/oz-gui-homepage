import { expect } from 'chai';
import { describe, it } from 'mocha';
import wait from 'ember-test-helpers/wait';
import ConflictIdsArray from 'oz-worker-gui/utils/conflict-ids-array';

import Ember from 'ember';

const {
  A,
} = Ember;

describe('Unit | Utility | conflict ids array', function() {
  it('computes conflict labels on init', function() {
    const array = new A([
      Ember.Object.create({
        id: 'abcdef1',
        name: 'Some',
      }),
      Ember.Object.create({
        id: 'abcdef2',
        name: 'Some',
      }),
    ]);
    
    let arrayProxy = ConflictIdsArray.create({
      content: array,
    });
    
    expect(arrayProxy.objectAt(0).get('conflictLabel')).to.equal('abcdef1');
    expect(arrayProxy.objectAt(1).get('conflictLabel')).to.equal('abcdef2');
  });
  
  it('computes conflict labels on array change', function(done) {
    const array = new A([
      Ember.Object.create({
        id: 'abcdef1',
        name: 'Some',
      }),
      Ember.Object.create({
        id: 'abcdef2',
        name: 'Some',
      }),
    ]);
    
    let arrayProxy = ConflictIdsArray.create({
      content: array,
    });
    array.pushObject(Ember.Object.create({
      id: 'abcdef3',
      name: 'Some',
    }));
    
    wait().then(() => {
      expect(arrayProxy.objectAt(2).get('conflictLabel')).to.equal('abcdef3');
      done();
    });
  });
});
