/**
 * An expose data tab content of add space storage modal
 * 
 * Generate a shell command for 'onedatifying' a collection to expose it in
 * a space.
 * 
 * @module components/modals/add-space-storage/expose-data
 * @author Jakub Liput
 * @copyright (C) 2017 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */

import TabBase from 'oz-worker-gui/components/modals/add-space-storage/-tab-base';

export default TabBase.extend({
  commandType: 'onedatify',
});
