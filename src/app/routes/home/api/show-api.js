import Ember from 'ember';

/**
 * FIXME: jsdoc
 * @module routes/home/api/component
 * @author Jakub Liput
 * @copyright (C) 2016 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Ember.Route.extend({
  model({component, version}) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      // FIXME: check presence of swagger json before redoc load
      if (component && version) {
        resolve(Ember.Object.create({
          component: component,
          version: version
        }));
      } else {
        reject();
      }
    });
  },
});
  