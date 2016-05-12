/* jshint expr:true */
import { expect } from 'chai';
import {
  describe,
  it
} from 'mocha';
import {
  safeElementId
} from 'oz-worker-gui/helpers/safe-element-id';

/// This is mainly a copy of safe-element-id-test utils test
/// but checks usage of helper method
describe('SafeElementIdHelper', function() {
  it('preserves alphanumeric chars and dashes', function() {
    expect(safeElementId(['hello-world'])).to.be.equal('hello-world');
  });

  it('eliminates # chars', function() {
    expect(safeElementId(['hello#onedata'])).to.be.equal('helloonedata');
  });

  it('eliminates . chars', function() {
    expect(safeElementId(['hello.onedata'])).to.be.equal('helloonedata');
  });
});
