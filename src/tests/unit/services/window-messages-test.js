/* jshint expr:true */
import { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'ember-cli-onedata-common/exports/sinon-chai';
import chai from 'chai';
chai.use(sinonChai);

import {
  describeModule,
  it
} from 'ember-mocha';

describeModule(
  'service:window-messages',
  'WindowMessagesService',
  {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  },
  function() {
    it('allows to register and invokes a window message handler', function() {
      const service = this.subject();
      const messageData = {type: 'hello-type', message: 'hello-message'};
      let event = {
        data: messageData
      };

      const handlerSpy = sinon.spy();

      service.onWindowMessage('hello-type', handlerSpy);
      service.handleMessage(event);

      expect(handlerSpy).to.have.been.calledWith(messageData);
    });

    it('allows to deregister a window message handler', function() {
      const service = this.subject();
      const messageData = {type: 'hello-type', message: 'hello-message'};
      let event = {
        data: messageData
      };

      let handlerSpy1 = sinon.spy();
      let handlerSpy2 = sinon.spy();

      service.onWindowMessage('hello-type', handlerSpy1);
      service.onWindowMessage('hello-type', handlerSpy2);
      service.offWindowMessage('hello-type', handlerSpy1);
      service.handleMessage(event);

      expect(handlerSpy1).to.have.not.been.called;
      expect(handlerSpy2).to.have.been.calledWith(messageData);
    });

    it('allows to deregister all window message handlers for type', function() {
      const service = this.subject();
      const messageData = {type: 'hello-type', message: 'hello-message'};
      let event = {
        data: messageData
      };

      let handlerSpy1 = sinon.spy();
      let handlerSpy2 = sinon.spy();

      service.onWindowMessage('hello-type', handlerSpy1);
      service.onWindowMessage('hello-type', handlerSpy2);
      service.offWindowMessage('hello-type');
      service.handleMessage(event);

      expect(handlerSpy1).to.have.not.been.called;
      expect(handlerSpy2).to.have.not.been.called;
    });
  }
);
