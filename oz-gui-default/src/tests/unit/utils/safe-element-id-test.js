/* jshint expr:true */
import { expect } from 'chai';
import {
  describe,
  it
} from 'mocha';
import safeElementId from 'oz-worker-gui/utils/safe-element-id';

describe('safeElementId', function() {
  it('preserves alphanumeric chars and dashes', function() {
    expect(safeElementId('hello-world')).to.be.equal('hello-world');
  });

  it('eliminates # chars', function() {
    expect(safeElementId('hello#onedata')).to.be.equal('helloonedata');
  });

  it('eliminates . chars', function() {
    expect(safeElementId('hello.onedata')).to.be.equal('helloonedata');
  });
});
