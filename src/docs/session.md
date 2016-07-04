Session management in application
=================================

On ``application`` route init, we invoke:

- application.js
  - on init: ``initSession()``
    - ``service:server`` -> ``.initWebsocket``
      - binds ``service:session``'s callbacks to websocket events
    - returns a promise that
      - resolves when ``this.sessionInitResolve`` is invoked
      - rejects when ``this.sessionInitReject`` is invoked
