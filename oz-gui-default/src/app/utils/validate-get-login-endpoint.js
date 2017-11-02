/**
 * Validate data returned by getLoginEndpoint from backend.
 * 
 * Returns true if data is valid (can be used)
 *
 * @module utils/validate-get-login-endpoint
 * @author Jakub Liput
 * @copyright (C) 2017 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default function validateGetLoginEndpoint({ method, url, formData }) {
  return !!((method === 'get' || (method === 'post' && typeof(formData) === 'object')) && url);
}
