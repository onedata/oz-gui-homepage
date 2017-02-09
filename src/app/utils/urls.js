const RE_ABSOLUTE_URL = new RegExp('^(?:[a-z]+:)?//', 'i');
const RE_DOCUMENT_PATH = new RegExp('^.*?.html(#.*)?$');

export function isAbsoluteUrl(url) {
  return RE_ABSOLUTE_URL.test(url);
}

export function isAbsolutePath(path) {
  return path.startsWith('/');
}

export function isDirectoryPath(path) {
  return !path.startsWith('#') && !RE_DOCUMENT_PATH.test(path);
}

/**
 * Returns absolute resource path for relative href from Gitbook page.
 * Handles also hash-only hrefs, so ``base`` can be file path and ``relative`` can be a hash.
 * Based on: http://stackoverflow.com/a/14780463
 * @example
 * ```
 * absolutePath('/doc/using_onedata/space_management.html', '../something.html')
 * // returns: /doc/something.html
 * ```
 * @return {String} absolute resource path (without origin, so this is not full URL!)
 */
export function absolutePath(base, relative) {
  if (relative.startsWith('#')) {
    return base + relative;
  } else {
    var stack = base.split("/"),
      parts = relative.split("/");
    // FIXME: check what if relative is href to other HTML file with hash
    // if relative href is only hash, do not remove HTML file name
    stack.pop(); // remove current file name (or empty string)
    for (var i = 0; i < parts.length; i++) {
      if (parts[i] === ".") {
        continue;
      }
      if (parts[i] === "..") {
        stack.pop();
      } else {
        stack.push(parts[i]);
      }
    }
    return '/' + stack.join("/");
  }
}

/**
 * Generate absolute URL, that is, what URL is accessed
 * when opening link with given href.
 * 
 * Based on:http://stackoverflow.com/a/14781678
 */
export function absoluteUrl(href, localDocument = document) {
  var link = localDocument.createElement("a");
  link.href = href;
  return (link.protocol + "//" + link.host + link.pathname + link.search + link.hash);
}
