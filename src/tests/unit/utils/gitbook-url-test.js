import { expect } from 'chai';
import { describe, it } from 'mocha';

import GitbookUrl from 'oz-worker-gui/utils/gitbook-url';

const HOMEPAGE_ORIGIN = window.location.origin;
const HOMEPAGE_DOCUMENTATION_PREFIX = '/home/documentation';
const DOCUMENTATION_PREFIX = '/documentation';

const gitbookUrl = new GitbookUrl(
  HOMEPAGE_ORIGIN,
  DOCUMENTATION_PREFIX,
  HOMEPAGE_DOCUMENTATION_PREFIX
);

describe('Unit | Utility | gitbook url', function() {
  // Replace this with your real tests.
  it('has homepageAbsoluteUrl method which handles hash hrefs', function() {
    expect(gitbookUrl.homepageAbsoluteUrl).to.be.ok;

    let result = gitbookUrl.homepageAbsoluteUrl(
      '#join-existing-space',
      'doc/using_onedata/space_management.html'
    );

    expect(result).to.be.equal(
      HOMEPAGE_ORIGIN + HOMEPAGE_DOCUMENTATION_PREFIX + '/doc/using_onedata/space_management.html#join-existing-space'
    );
  });
});
