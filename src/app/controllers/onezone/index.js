import Ember from 'ember';

/**
 * Used for loading state of view.
 * @module controllers/onezone/index
 * @author Jakub Liput
 * @copyright (C) 2016 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Ember.Controller.extend({
  providers: Ember.computed.alias('model'),
  isLoading: Ember.computed.alias('providers.isUpdating')
});
