/**
 * A container for spin-spinner that helps to render a loading spinner 
 * 
 * NOTE this is copied component from onepanel-gui project 
 *
 * @module components/spin-spinner-block
 * @author Jakub Liput
 * @copyright (C) 2017 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */

import Ember from 'ember';

const PREDEF_SIZES = {
  xs: 0.2,
  sm: 0.4,
  md: 0.8,
  lg: 1.2
};

const {
  computed
} = Ember;

export default Ember.Component.extend({
  tagName: 'div',
  classNames: ['spin-spinner-block', 'spinner-container'],
  classNameBindings: ['sizeClass'],

  sizeClass: 'lg',

  spinnerScale: computed('sizeClass', function () {
    return PREDEF_SIZES[this.get('sizeClass')];
  })
});
