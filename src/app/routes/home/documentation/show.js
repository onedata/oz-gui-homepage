import Ember from 'ember';

import {
  serializePathWithHash,
  deserializePathWithHash,
  isAbsoluteUrl
} from 'oz-worker-gui/utils/urls';

const {
  Route,
  RSVP: {
    Promise
  }
} = Ember;

export default Route.extend({
  model({ gitbook_path }) {
    return new Promise((resolve, reject) => {
      if (isAbsoluteUrl(gitbook_path)) {
        console.error('Tried to pass absolute URL as documentation source');
        reject();
      } else {
        resolve(deserializePathWithHash(gitbook_path));
      }
    });
  },

  actions: {
    gitbookPathChanged(path) {
      this.transitionTo('home.documentation.show', serializePathWithHash(path));
    },
    invalidPageOpened() {
      this.transitionTo('home.documentation');
    }
  }
});
