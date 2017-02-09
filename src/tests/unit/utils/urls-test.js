import { expect } from 'chai';
import { describe, it } from 'mocha';
import urls from 'oz-worker-gui/utils/urls';

describe('Unit | Utility | urls', function() {
  // Replace this with your real tests.
  it('has isAbsolutePath function which detects absolute path', function() {
    let isAbsolutePath = urls.isAbsolutePath;
    expect(isAbsolutePath).to.be.ok;

    let result = isAbsolutePath('/hello/world');
    
    expect(result).to.be.true;
  });
  it('has isAbsolutePath function which detects relative path', function() {
    let isAbsolutePath = urls.isAbsolutePath;
    expect(isAbsolutePath).to.be.ok;

    let result = isAbsolutePath('hello/world');
    
    expect(result).to.be.false;
  });
  it('has isDirectoryPath function which detects directory path', function() {
    let isDirectoryPath = urls.isDirectoryPath;
    expect(isDirectoryPath).to.be.ok;

    let result = isDirectoryPath('/hello/world');
    
    expect(result).to.be.true;
  });
  it('has isDirectoryPath function which detects non-directory path', function() {
    let isDirectoryPath = urls.isDirectoryPath;
    expect(isDirectoryPath).to.be.ok;

    let result = isDirectoryPath('/hello/world.html');
    
    expect(result).to.be.false;
  });
  it('has isDirectoryPath function which detects hash', function() {
    let isDirectoryPath = urls.isDirectoryPath;
    expect(isDirectoryPath).to.be.ok;

    let result = isDirectoryPath('#world');
    
    expect(result).to.be.false;
  });
  it('has absolutePath function which handles hashes', function() {
    let absolutePath = urls.absolutePath;
    expect(absolutePath).to.be.ok;

    let result = absolutePath('/hello/foo.html', '#world');
    
    expect(result).to.be.equal('/hello/foo.html#world');
  });
});
