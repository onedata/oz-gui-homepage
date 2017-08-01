import { expect } from 'chai';
import { describe, it } from 'mocha';
import browserPost from 'oz-worker-gui/utils/browser-post';

describe('Unit | Utility | browser post', function() {
  // Replace this with your real tests.
  it('works', function() {
    let result = browserPost();
    expect(result).to.be.ok;
  });
});
