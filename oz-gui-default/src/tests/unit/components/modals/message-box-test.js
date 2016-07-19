/* jshint expr:true */
import { expect } from 'chai';
import {
  describeComponent,
  it
} from 'ember-mocha';

describeComponent(
  'modals/message-box',
  'ModalsMessageBoxComponent',
  {
    // Specify the other units that are required for this test
    needs: ['component:bs-modal', 'component:bs-modal-body', 'helper:eq',
      'component:status-panel'],
    unit: true
  },
  function() {
    it('renders', function() {
      // creates the component instance
      let component = this.subject();
      // renders the component on the page
      this.render();
      expect(component).to.be.ok;
      expect(this.$()).to.have.length(1);
    });
  }
);
