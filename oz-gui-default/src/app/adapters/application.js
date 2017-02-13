/**
 * Imports a default adapter for application - currently Onedata adapter is used.
 * @module adapters/application
 * @author Jakub Liput
 * @copyright (C) 2016 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */

import OnedataWebsocketAdapter from 'ember-cli-onedata-common/adapters/onedata-websocket';
import LSAdapter from './application-localstorage';

import ENV from '../config/environment';

let ApplicationAdapter =
  (ENV.environment === 'test' ? LSAdapter : OnedataWebsocketAdapter);

export default ApplicationAdapter;
