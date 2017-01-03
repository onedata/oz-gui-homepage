import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration | Component | modals/change password', function() {
  setupComponentTest('modals/change-password', {
    integration: true
  });

  it('renders with password inputs', function() {
    this.render(hbs`{{modals/change-password}}`);
    let $element = this.$('.modals-change-password');

    expect($element).to.exist;
    expect($element.find('input[type=password]')).to.have.length.gte(3);
  });
});
