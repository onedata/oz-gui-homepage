import Ember from 'ember';
import ProviderSpaceComponentMixin from 'oz-worker-gui/mixins/components/provider-space';

/**
 * A list entry for single space in context of particular provider
 * in provider-place-drop.
 * 
 * Styles are in ``provider-place-drop`` SCSS file.
 * 
 * @module components/provider-place-drop-space
 * @author Jakub Liput
 * @copyright (C) 2016 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Ember.Component.extend(ProviderSpaceComponentMixin, {  
  classNames: ['provider-place-drop-space']
});
