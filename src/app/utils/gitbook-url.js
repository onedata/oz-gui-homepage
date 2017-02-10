import {
  isAbsoluteUrl,
  isAbsolutePath,
  isDirectoryPath,
  absolutePath
} from 'oz-worker-gui/utils/urls';

class GitbookUrl {
  constructor(origin, documentationPrefix, homepageDocumentationPrefix) {
    this.origin = origin;
    this.documentationPrefix = documentationPrefix;
    this.homepageDocumentationPrefix = homepageDocumentationPrefix;

    this.reDocumentationUrl = new RegExp(this.origin + this.documentationPrefix + '/(.*)');
    this.reHomepageUrl = new RegExp(this.origin + this.homepageDocumentationPrefix + '/(.*)');
  }

  gitbookPathToSrc(gitbookPath = 'index.html') {
    return this.documentationPrefix + '/' + gitbookPath;
  }

  gitbookUrl(gitbookPath) {
    return this.origin + this.gitbookPathToSrc(gitbookPath);
  }

  homepageAbsoluteUrl(originalHref, startGitbookPath) {
    let path = isAbsolutePath(originalHref) ?
      originalHref : absolutePath(startGitbookPath, originalHref);

    if (isDirectoryPath(path)) {
      if (!originalHref.startsWith('#') && !path.endsWith('/')) {
        path += '/';
      }
      path += 'index.html';
    }
    let url = this.origin + this.homepageDocumentationPrefix + path;
    return url;
  }

  homepageHref(originalHref, startGitbookPath) {
    if (isAbsoluteUrl(originalHref)) {
      return originalHref;
    } else {
      return this.homepageAbsoluteUrl(originalHref, startGitbookPath);
    }
  }

  stripHomepageDocumentationUrl(url) {
    return url.match(this.reHomepageUrl)[1];
  }

  stripDocumentationUrl(url) {
    return url.match(this.reDocumentationUrl)[1];
  }
}

export default GitbookUrl;