import Ember from 'ember';

/**
 * FIXME: jsdoc
 * @module controllers/home/api
 * @author Jakub Liput
 * @copyright (C) 2016 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Ember.Controller.extend({
  /**
   * @type {String}
   */
  version: null,

  /**
   * @type {String}
   */
  component: null, 

  components: Ember.computed('model.components.[]', function() {
    let versions = this.get('model');
    return versions.components.map(c => Ember.Object.create({
      name: c.name,
      id: Ember.String.camelize(c.name),
    }));
  }),

  swaggerJsonUrl: Ember.computed('selectedVersion', 'selectedComponent', function() {
    let {version, component} =
      this.getProperties('version', 'component');
    
    return `https://onedata.org/docs/doc/swagger/${version}/${component}/swagger.json`;
  })
});
