import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration | Component | social box', function() {
  setupComponentTest('social-box', {
    integration: true
  });

  it('renders with style specified constructed from arguments', function() {
    this.render(hbs`{{social-box
      authId="custom"
      iconPath="/custom_dir/custom.svg"
      iconBackgroundColor="#fff"
      tip="hello world"
    }}`);
    const $loginIconBox = this.$('.social-box-component .login-icon-box');
    const $socialIconImage = $loginIconBox.find('.social-icon-image');
    expect($loginIconBox).to.exist;
    expect($loginIconBox, $loginIconBox.attr('class')).to.have.class('idp-custom');
    expect($loginIconBox.attr('style')).to.match(/\s*background-color:\s*#fff;\s*/);
    expect($socialIconImage).to.exist;
    expect($socialIconImage.attr('style')).to.match(/\s*background-image:.*\/custom_dir\/custom\.svg.*;\s*/);
  });
});
