import Ember from 'ember';
import ProviderSpaceComponentMixin from 'oz-worker-gui/mixins/components/provider-space';


/**
 * A space entry in spaces list of single provider in sidebar.
 * @module components/providers-accordion-item-space
 * @author Jakub Liput
 * @copyright (C) 2016 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Ember.Component.extend(ProviderSpaceComponentMixin, {
  classNames: [
    'secondary-item-container',
    'sidebar-provider-space',
    'non-hoverable'
  ]
});
