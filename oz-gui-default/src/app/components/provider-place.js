import Ember from 'ember';

/**
 * A circle representing a provider on world map.
 * @module components/provider-place
 * @author Jakub Liput
 * @copyright (C) 2016 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Ember.Component.extend({
  classNames: ['provider-place'],
  classNameBindings: ['isWorking'],

  isWorking: function() {
    return this.get('provider.isWorking') ? 'working' : '';
  }.property('provider.isWorking'),

  /** A provider model that will be represented on map */
  provider: null,

  // TODO: map to provider props
  latitude: Ember.computed.alias('provider.latitude'),
  longitude: Ember.computed.alias('provider.longitude'),

  width: function() {
    return this.get('atlas.width')*0.02;
  }.property('atlas.width'),

  height: Ember.computed.alias('width'),

  sizeChanged: function() {
    let circle = this.$().find('.circle');
    circle.css({
      fontSize: this.get('width')*0.75 + 'px',
      lineHeight: this.get('height')*0.90 + 'px',
      width: this.get('width') + 'px',
      height: this.get('height') + 'px',
    });
  }.observes('width', 'height'),

  posY: function() {
    let h = this.get('atlas.height');
    let ltr = this.get('latitude') * (Math.PI/180);

    let y = 1.25 * Math.log(Math.tan(Math.PI / 4 + 0.4 * ltr));
    let yp = this.get('atlas.centerY') - (h/2) * y * (1/2.303412543) - this.get('height')/2;
    console.debug(`lat ${ltr} -> y ${y} -> y' ${yp}`);
    return yp;
  }.property('latitude', 'atlas.centerY', 'height'),

  posX: function() {
    return this.get('atlas.centerX') +
      (this.get('longitude')/180)*(this.get('atlas.width')/2) -
      (this.get('width')/2);
  }.property('longitude', 'atlas.centerX', 'atlas.width', 'width'),

  positionChanged: function() {
    if (this.get('posX') && this.get('posY')) {
      this.$().css('left', `${this.get('posX')}px`);
      this.$().css('top', `${this.get('posY')}px`);
    }
  }.observes('posX', 'posY'),

  isActive: function() {
    return this.get('provider.isSelected');
  }.property('provider.isSelected'),

  didInsertElement() {
    this.positionChanged();
    this.sizeChanged();
  },

  actions: {
    toggleActive() {
      this.sendAction('selectProvider', this.get('provider'));
    }
  }
});
