import { expect } from 'chai';
import { describe, it } from 'mocha';

import GitbookUrl from 'oz-worker-gui/utils/gitbook-url';

const HOMEPAGE_ORIGIN = 'https://example.com';
const HOMEPAGE_DOCUMENTATION_PREFIX = '/#/home/documentation';
const DOCUMENTATION_PREFIX = '/docs';

const URL_PREFIX = HOMEPAGE_ORIGIN + HOMEPAGE_DOCUMENTATION_PREFIX;

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
      URL_PREFIX + '/doc/using_onedata/space_management.html#join-existing-space'
    );
  });
  it('has homepageAbsoluteUrl method which handles relative paths with parent dirs', function() {
    expect(gitbookUrl.homepageAbsoluteUrl).to.be.ok;

    let result = gitbookUrl.homepageAbsoluteUrl(
      '../../doc/using_onedata/file_management.html',
      'doc/using_onedata/file_management.html'
    );

    expect(result).to.be.equal(
      URL_PREFIX + '/doc/using_onedata/file_management.html'
    );
  });
  it('has homepageAbsoluteUrl method which handles relative paths with hashes', function() {
    expect(gitbookUrl.homepageAbsoluteUrl).to.be.ok;

    let result = gitbookUrl.homepageAbsoluteUrl(
      'doc/using_onedata/file_management.html#some-p',
      'index.html'
    );

    expect(result).to.be.equal(
      URL_PREFIX + '/doc/using_onedata/file_management.html#some-p'
    );
  });
});
