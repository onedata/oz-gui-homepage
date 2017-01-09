import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration | Component | dialog modal', function() {
  setupComponentTest('dialog-modal', {
    integration: true
  });

  it('renders', function() {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    // Template block usage:
    // this.render(hbs`
    //   {{#dialog-modal}}
    //     template content
    //   {{/dialog-modal}}
    // `);

    this.render(hbs`{{dialog-modal}}`);
    expect(this.$()).to.have.length(1);
  });
});
