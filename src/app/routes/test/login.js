/**
 * A login test page. Is available regardless user authentication state.
 * @module routes/test/login
 * @author Michal Borzecki
 * @copyright (C) 2018 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */

import LoginRoute from 'oz-worker-gui/routes/home/login';

export default LoginRoute.extend({
  /**
   * @override
   */
  redirectIfAuthenticated: false,
});
