/**
 * An utils for binding fixed position of an element to other element that is on top
 *
 * @module utils/bind-element-top
 * @author Jakub Liput
 * @copyright (C) 2017 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */

/**
 * Makes ``belowElement`` fixed to be fully stretched below ``aboveElement``
 * 
 * @export
 * @param {JQuery} $topElement 
 * @param {JQuery} $bottomElement 
 * @returns 
 */
export default function($topElement, $bottomElement) {
  $bottomElement.css({
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0
  });
  let __resizeFun = () => {
    $bottomElement.css('top', ($topElement.offset().top + $topElement.height()) + 'px');
  };
  __resizeFun();
  return __resizeFun;
}
    