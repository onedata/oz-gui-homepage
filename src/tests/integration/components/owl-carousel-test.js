/* jshint expr:true */
import { expect } from 'chai';
import {
  describeComponent,
  it
} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describeComponent(
  'owl-carousel',
  'Integration: OwlCarouselComponent',
  {
    integration: true
  },
  function() {
    it('renders', function() {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      // Template block usage:
      // this.render(hbs`
      //   {{#owl-carousel}}
      //     template content
      //   {{/owl-carousel}}
      // `);

      this.render(hbs`{{owl-carousel}}`);
      expect(this.$()).to.have.length(1);
    });
  }
);
