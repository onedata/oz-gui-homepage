import Ember from 'ember';

/**
 * Global control of ``onezone-sidebar`` component.
 * The ``onezone`` sidebar component should register itself in service using:
 * ``this.set('onezoneSidebar.component', this)``
 * @module services/onezone-sidebar
 * @author Jakub Liput
 * @copyright (C) 2016-2017 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Ember.Service.extend({
  component: null,

  collapseFor(name) {
    return this.get('component').$(`#collapse-${name}`);
  },

  collapseHeaderFor(name) {
    return this.get('component').$(`[href="#collapse-${name}"] h1`);
  },

  animateCollapseHeader(name) {
    let $collapseHeader = this.collapseHeaderFor(name);
    $collapseHeader.animateCss('sidebar-tab-flash');
  },

  expandMain(name) {
    let $collapse = this.collapseFor(name);
    $collapse.collapse('show');
    this.animateCollapseHeader(name);
  },

  collapseMain(name) {
    let $collapse = this.collapseFor(name);
    $collapse.collapse('hide');
    this.animateCollapseHeader(name);
  }
});