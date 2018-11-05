/**
 * Login controller for test mode.
 * 
 * @module controllers/test/login
 * @author Jakub Liput
 * @copyright (C) 2018 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */

import LoginController from 'oz-worker-gui/controllers/home/login';

export default LoginController.extend({
  testMode: true,
});
