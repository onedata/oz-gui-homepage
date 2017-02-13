export function initialize(application) {
  application.inject('component', 'session', 'service:session');
  application.inject('route', 'session', 'service:session');
}

export default {
  name: 'inject-session',
  after: 'ember-simple-auth',
  initialize: initialize,
};
