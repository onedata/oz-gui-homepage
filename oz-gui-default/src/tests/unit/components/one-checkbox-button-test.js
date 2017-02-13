/* jshint expr:true */
import { expect } from 'chai';
import { it, describe } from 'mocha';
import { setupComponentTest } from 'ember-mocha';

describe('OneCheckboxButtonComponent', function() {
  setupComponentTest('one-checkbox-button', {
    needs: ['component:one-icon'],
    unit: true
  });

  it('renders', function() {
    // creates the component instance
    let component = this.subject();
    // renders the component on the page
    this.render();
    expect(component).to.be.ok;
    expect(this.$()).to.have.length(1);
  });
});
