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
  let absolutePath;
  if (relative.startsWith('#')) {
    absolutePath = stripHash(base) + relative;
  } else {
    var stack = base.split("/"),
      parts = relative.split("/");
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
    absolutePath = stack.join("/");
  }
  if (!absolutePath.startsWith('/')) {
    absolutePath = '/' + absolutePath;
  }
  return absolutePath;
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

const RE_PATH_WITH_HASH =  /^(.*)\.html#(.*)$/;

export function serializePathWithHash(rawPath) {
  return rawPath.replace(RE_PATH_WITH_HASH, '$1[$2].html');
}

const RE_SERIALIZED_PATH_WITH_HASH = /^(.*?)\[(.*?)\].html$/;

export function deserializePathWithHash(serializedPath) {
  return serializedPath.replace(RE_SERIALIZED_PATH_WITH_HASH, '$1.html#$2');
}

const RE_STRIP_HASH = /(.*)?#.*/;

export function stripHash(path) {
  return path.replace(RE_STRIP_HASH, '$1');
}
