/**
 * An integration code for Onedata Homepage with ReDoc.
 * NOTE that Babel is not used for this file - write in compatible ES5.
 * 
 * Injected variables:
 * - document.apiBaseUrl: String - eg. https://veilfsdev.com/#/home/api/3.0.0-rc11/onezone
 * - document.apiAnchor: String - eg. #operation/get_space - as in original ReDoc hrefs
 * - document.parentOrigin: String - window.location.origin of OZ app in time when it generated iframe content
 * 
 * @author Jakub Liput
 * @copyright (C) 2016-2017 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */

// note, that it works only for one level iframe
var PARENT_WINDOW = window.parent;

var JUMP_SCROLL_MARGIN_TOP = 12;

// get hash part from URL (cutting # sign)
var RE_HASH = /.*?#(.*)/;

/**
 * jQuery offset method (fitted to this code)
 */
function offset(elem) {
  var docElem, rect;

  if (!elem) {
    return;
  }

  rect = elem.getBoundingClientRect();

  // Make sure element is not hidden (display: none) or disconnected
  if ( rect.width || rect.height || elem.getClientRects().length ) {
    docElem = document.documentElement;

    return {
      top: rect.top + window.pageYOffset - docElem.clientTop,
      left: rect.left + window.pageXOffset - docElem.clientLeft
    };
  }
}

/**
 * There are multiple anchor types and jumping to their places
 * are different, so we need to distinguish them.
 * @param {String} originalHref (not a homepage href!)
 */
function anchorType(anchor) {
  var match = anchor.match(/^#?(section|tag|operation)/);
  return match ? match[1] : null;
}

function stripHashChar(anchor) {
  if (anchor.charAt(0) === '#') {
    anchor = anchor.substr(1);
  }
  return anchor;
}

/**
 * Scroll to proper element basing on anchor (original href).
 * @param {String} anchor eg. #operation/get_space (with or without # sign)
 */
function jumpToAnchor(anchor) {
  var type = anchorType(anchor);
  anchor = stripHashChar(anchor);
  var element;
  switch (type) {
    case 'section':
      element = document.querySelector('h1[section="' + anchor + '"] .share-link, h2[section="' + anchor + '"] .share-link');
      break;
    case 'tag':
      element = document.querySelector('div.tag-info a.share-link[orig-href="#' + anchor + '"]');
      // find .tag-info parent
      while (!element.classList.contains('tag-info')) {
        element = element.parentElement;
      }
      break;
    case 'operation':
      var operationId = anchor.match(/operation\/(.*)/)[1];
      element = document.querySelector('operation[operation-id="' + operationId + '"] .operation-content .operation-header');
      break;
    default:
      throw 'Cannot resolve anchor type: ' + anchor;
  }
  window.scrollTo(0, offset(element).top - JUMP_SCROLL_MARGIN_TOP);
}

/**
 * An external link to access section/operation/tag using Onedata Homepage wrapper.
 * @return {String} Eg. https://veilfsdev.com/#/home/api/3.0.0-rc11/onezone?anchor=#operation/modify_provider
 */
function homepageLink(originalHref) {
  var link = document.apiBaseUrl;
  if (originalHref) {
    link += '?anchor=' + stripHashChar(originalHref);
  }
  return link;
}

/**
 * Prevent to go to external API documentation section link, because we are in iframe.
 * Instead jump to anchor (see ``jumoToAnchor``).
 * @param {MouseEvent} event
 */
function handleLinkOpen(event) {
  event.preventDefault();
  event.stopImmediatePropagation();
  var origHref = event.target.getAttribute('orig-href');
  PARENT_WINDOW.location = homepageLink(origHref);
}

/**
 * When all links are rendered, we want to change them:
 * 1. to handle click with our custom method - ``handleLinkOpen``,
 * 2. to have external href for accessing section/tag/operation from
 *    outside Homepage.
 */
function afterRender() {
  console.debug('Onedata ReDoc integration: after render');
  // live collection
  var shareLinks = document.getElementsByClassName('share-link');
  Array.from(shareLinks).forEach(function(sl) {
    var origHref = sl.getAttribute('href');
    sl.setAttribute('orig-href', origHref);
    sl.setAttribute('href', homepageLink(origHref));
    // it works even with pressing "enter" on link
    sl.addEventListener('click', handleLinkOpen);
  });
  // HACK convert wrongly generated swagger.json links (badly used relative link)
  try {
    var swaggerUrl = document.getElementsByClassName('openapi-button')[0].href;
    Array.from(document.getElementsByTagName('a')).filter(function(a) {
      return a.href.match(/swagger.json/);
    }).forEach(function(a) {
      a.href = swaggerUrl;
    });
  } catch (error) {
    console.warn('Failed to convert bad relative swagger.json links: ' + error);
  }
  
  PARENT_WINDOW.postMessage({type: 'redoc-rendered'}, document.parentOrigin);
  if (document.apiAnchor) {
    redocAnchorChanged(document.apiAnchor);
  }
}

function redocAnchorChanged(anchor) {
  jumpToAnchor(anchor);
}

function getUrlHashPart(url) {
  return url.match(RE_HASH)[1];
}

function handleMessage(event) {
  var type = event.data.type;
  var message = event.data.message;
  if (type === 'anchor-changed') {
    redocAnchorChanged(message);
  }
}

// pass ReDoc URL change parent window
window.history.replaceState = function (stateObj, title, url) {
  PARENT_WINDOW.history.replaceState(null, null, homepageLink(getUrlHashPart(url)));
};

/// MAIN - wait for ReDoc to render (currently polling) and perform integration tasks

var __ONEDATA__redocIsReady = false;
var __ONEDATA__redocCheckReadyId = null;

function checkReady() {
  if (__ONEDATA__redocIsReady) {
    window.clearInterval(__ONEDATA__redocCheckReadyId);
  } else if (!document.querySelector('redoc.loading')) {
    __ONEDATA__redocIsReady = true;
    afterRender();
  }
}

__ONEDATA__redocCheckReadyId = window.setInterval(checkReady, 100);

window.addEventListener("message", handleMessage, false);
