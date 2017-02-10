import { expect } from 'chai';
import { describe, it } from 'mocha';
import urls from 'oz-worker-gui/utils/urls';

describe('Unit | Utility | urls', function() {
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
  it('has absolutePath function which handles relative path with hash', function() {
    let absolutePath = urls.absolutePath;
    expect(absolutePath).to.be.ok;

    let result = absolutePath('/hello/foo.html', 'world/bar.html#baz');
    
    expect(result).to.be.equal('/hello/world/bar.html#baz');
  });
  it('has absolutePath function which handles hashes', function() {
    let absolutePath = urls.absolutePath;
    expect(absolutePath).to.be.ok;

    let result = absolutePath('/hello/foo.html', '#world');
    
    expect(result).to.be.equal('/hello/foo.html#world');
  });
  it('has absolutePath function which generates valid URLs from relative paths with parent dirs', function() {
    let absolutePath = urls.absolutePath;
    expect(absolutePath).to.be.ok;

    let result = absolutePath(
      '/hello/world/foo.html',
      '../bar.html'
    );
    
    expect(result).to.be.equal('/hello/bar.html');
  });
  it('has absolutePath function which generates valid URLs from relative paths', function() {
    let absolutePath = urls.absolutePath;
    expect(absolutePath).to.be.ok;

    let result = absolutePath(
      '/hello/world/foo.html',
      'other/bar.html'
    );
    
    expect(result).to.be.equal('/hello/world/other/bar.html');
  });
});
