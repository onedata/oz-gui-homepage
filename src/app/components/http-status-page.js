/**
 * A component that shows fancy page if the HTTP error occurs.
 * 
 * @module components/http-status-page
 * @author Jakub Liput
 * @copyright (C) 2018 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */

import Ember from 'ember';

const {
  Component,
  computed,
  inject: { service },
} = Ember;

export default Component.extend({
  classNames: ['http-status-page'],
  
  i18n: service(),
  
  /**
   * @virtual
   * HTTP status code
   * @type {number}
   */
  statusCode: undefined,
  
  header: computed('statusCode', function header() {
    const statusCode = this.get('statusCode');
    const codeLocale = statusCode === 404 ? '404' : 'error';
    return `${statusCode} ${this.get('i18n').t(`components.httpStatusPage.header.${codeLocale}`)}`;
  }),
  
  subheader: computed('statusCode', function subheader() {
    const statusCode = this.get('statusCode');
    const codeLocale = statusCode === 404 ? '404' : 'error';
    return this.get('i18n').t(`components.httpStatusPage.subheader.${codeLocale}`);
  }),
});
