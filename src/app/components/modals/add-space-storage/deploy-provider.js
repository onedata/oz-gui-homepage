/**
 * A deploy provider tab content of add space storage modal
 * 
 * Generate a shell command for deploying a provider that will automatically 
 * support this space.
 * 
 * @module components/modals/add-space-storage/deploy-provider
 * @author Jakub Liput
 * @copyright (C) 2017 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */

import TabBase from 'oz-worker-gui/components/modals/add-space-storage/-tab-base';

export default TabBase.extend({
  commandType: 'oneprovider',
});
