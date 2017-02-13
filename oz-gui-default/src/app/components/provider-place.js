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

  /**
   * To inject.
   * A provider model that will be represented on map
   * @required
   * @type {Provider}
   */
  provider: null,

  isWorking: Ember.computed('provider.isWorking', function() {
    return this.get('provider.isWorking') ? 'working' : '';
  }),

  // TODO: map to provider props
  latitude: Ember.computed('provider.latitude', function() {
    const lat = this.get('provider.latitude');
    return lat >= -90 && lat <= 90 ? lat : 0;
  }),

  longitude: Ember.computed('provider.longitude', function() {
    const lon = this.get('provider.longitude');
    return lon >= -180 && lon <= 180 ? lon : 0;
  }),

  width: Ember.computed('atlas.width', function() {
    return this.get('atlas.width')*0.02;
  }),

  height: Ember.computed.alias('width'),

  isActive: Ember.computed.readOnly('provider.isSelected'),

  sizeChanged: Ember.observer('width', 'height', function() {
    let {width, height} = this.getProperties('width', 'height');

    let circle = this.$().find('.circle');
    circle.css({
      fontSize: width*0.75 + 'px',
      lineHeight: height*0.90 + 'px',
      width: width + 'px',
      height: height + 'px',
    });
  }),

  posY: Ember.computed('atlas.{height,centerY}', 'latitude', 'height', function() {
    let {height: h, centerY: atlasCenterY} = this.get('atlas').getProperties('height', 'centerY');
    let {latitude, height} = this.getProperties('latitude', 'height');
    let ltr = latitude * (Math.PI/180);

    let y = 1.25 * Math.log(Math.tan(Math.PI / 4 + 0.4 * ltr));
    let yp = atlasCenterY - (h/2) * y * (1/2.303412543) - height/2;
    console.debug(`lat ${ltr} -> y ${y} -> y' ${yp}`);
    return yp;
  }),

  posX: Ember.computed('atlas.{width,centerX}', 'longitude', 'width', function() {
    let {width: atlasWidth, centerX: atlasCenterX} = this.get('atlas').getProperties('width', 'centerX');
    let {longitude, width} = this.getProperties('longitude', 'width');

    return atlasCenterX +
      (longitude/180)*(atlasWidth/2) -
      (width/2);
  }),

  positionChanged: Ember.observer('posX', 'posY', function() {
    let {posX, posY} = this.getProperties('posX', 'posY');

    if (posX && posY) {
      this.$().css({
        top: `${posY}px`,
        left: `${posX}px`
      });
    }
  }),

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
