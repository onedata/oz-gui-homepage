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
  try {
    var match = anchor.match(/^#?(section|tag|operation)/);
    return match ? match[1] : null;
  } catch (error) {
    return null;
  }
}

function stripHashChar(anchor) {
  if (anchor && anchor.charAt(0) === '#') {
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
    case 'tag':
    case 'operation':
      element = document.querySelector('div[data-section-id="' + anchor + '"]');
      break;
    default:
      throw 'Cannot resolve anchor type: ' + anchor;
  }
  window.scrollTo(0, offset(element).top + 4);
  return element;
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
 * Instead jump to anchor (see ``jumpToAnchor``).
 * @param {MouseEvent} event
 */
function handleLinkOpen(event) {
  event.preventDefault();
  event.stopImmediatePropagation();
  var origHref = event.target.getAttribute('orig-href');
  if (origHref) {
    PARENT_WINDOW.location = homepageLink(origHref);
  } else {
    PARENT_WINDOW.location = event.currentTarget.getAttribute('href');
  }
}

function handleMenuItemOpen(event) {
  PARENT_WINDOW.location = homepageLink(event.currentTarget.getAttribute('data-item-id'));
  event.stopPropagation();
}

function processInternalLink(lnk) {
  var origHref = lnk.getAttribute('href');
  lnk.setAttribute('orig-href', origHref);
  lnk.setAttribute('href', homepageLink(origHref));
  // it works even with pressing "enter" on link
  lnk.addEventListener('click', handleLinkOpen); 
  lnk.setAttribute('data-is-click-handler', 'true');
}

/**
 * When all links are rendered, we want to change them:
 * 1. to handle click with our custom method - ``handleLinkOpen``,
 * 2. to have external href for accessing section/tag/operation from
 *    outside Homepage.
 */
function postProcessing() {
  console.debug('Onedata ReDoc integration: post processing');
  // live collection
  var anchorLinks = document.querySelectorAll('a[href^="#"]:not([orig-href]):not([data-is-click-handler])');
  Array.from(anchorLinks).forEach(processInternalLink);
  var externalLinks = document.querySelectorAll('a:not([href^="#"]):not([orig-href]):not([data-is-click-handler])');
  Array.from(externalLinks).forEach(function(lnk) {
    lnk.addEventListener('click', handleLinkOpen); 
    lnk.setAttribute('data-is-click-handler', 'true');
  });
  var menuItems = document.querySelectorAll('li[data-item-id]:not([data-is-click-handler])');
  Array.from(menuItems).forEach(function(item) {
    item.addEventListener('click', handleMenuItemOpen);
    item.setAttribute('data-is-click-handler', 'true');
  });
  // HACK convert wrongly generated swagger.json links (badly used relative link)
  try {
    var swaggerUrl = window.location.href.replace(/(.*)\/.*/, '$1/swagger.json');
    Array.from(document.querySelectorAll('a[href*="swagger.json"]'))
      .forEach(function(a) {
        a.href = swaggerUrl;
      });
  } catch (error) {
    console.warn('Failed to convert bad relative swagger.json links: ' + error);
  }
  // convert documentation links
  try {
    Array.from(document.querySelectorAll('a[href^="https://onedata.org/docs/doc/"]'))
      .forEach(function(a) {
        a.href = a.href.replace(/https:\/\/onedata.org\/docs\//g, window.location.origin + '/#/home/documentation/');
      });
  } catch (error) {
    console.warn('Failed to convert bad relative swagger.json links: ' + error);
  }
  
  if (document.postProcessingIteration < 1) {
    var logo = document.querySelector('img[src$="-logo.svg"');
    if (logo) {
      logo.setAttribute('src', logo.getAttribute('src').replace('https://onedata.org/', '/'));
    }
    // HACK remove misleading link from logo
    var logoLink = document.querySelector('.menu-content a[href^="https://onedata.org"]');
    if (logoLink) {
      logoLink.href = 'javascript:void(0);';
    }
    // HACK hack for current wrong links, it should be fixed in documentation in future
    var supportLinks = document.querySelectorAll('a[href="https://onedata.org/support"]');
    Array.from(supportLinks).forEach(function(a) {
      a.href = 'https://onedata.org/#/home/support';
    });
  }
  
  if (document.iframeLoaded) {
    var anchorElement = redocAnchorChanged(document.apiAnchor);
    if (anchorElement) {
      document.postProcessingJumpDone = true;
    }
  } else {
    setTimeout(postProcessing, 200);
  }
  
  document.postProcessingIteration += 1;
}

function redocAnchorChanged(anchor) {
  return jumpToAnchor(anchor);
}

function getUrlHashPart(url) {
  var m = url.match(RE_HASH);
  return m ? m[1] : '';
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

/// MAIN

window.addEventListener("message", handleMessage, false);

document.postProcessingIteration = 0;
postProcessing();
