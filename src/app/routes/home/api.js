import Ember from 'ember'; 

const VERSIONS_PATH = '/swagger/versions.json'; 

export default Ember.Route.extend({
  /**
   * The model is API versions object provided as a get JSON.
   * See JSON from ``VERSIONS_PATH`` for object example.
   * @example
   * ```
   * {
   *  "default": <version string>
   *  "order": <Array of version strings>
   *  "versions": {
   *    <version string>: {
   *      "changelog": <changelog string>
   *    }
   *  },
   *  "components": [
   *    {
   *      "id": <api component id string>
   *      "name": <api component displayed name string>
   *      "description": <api component description string>
   *    }
   *  ]
   * }
   * ```
   * @type {Promise<Object>}
   */
  model() {
    return new Ember.RSVP.Promise((resolve, reject) => {
      $.ajax({
        url: VERSIONS_PATH,
        dataType: 'json',
        success: (data) => resolve(data),
        error: () => reject()
      });
    });
  },
});
