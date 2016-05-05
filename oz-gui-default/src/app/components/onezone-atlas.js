import Ember from 'ember';

// TODO: clip the south of atlas
// - new aspect ratio (to size of clipped image) - compute from stored image size?
// - centerY should be computed regards to new atlas center position (percentaage)
//   because its not anymore in the height/2
// - provider-place component should use width/height other than width/height of
//   displayed image - it should be a separate property of onezone-atlas

/**
 * A world map, on which providers are placed.
 * @module components/onezone-atlas
 * @author Jakub Liput
 * @copyright (C) 2016 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */
export default Ember.Component.extend({
  classNames: ['onezone-atlas'],

  // Map size (rasterized): 2058 × 1512
  // Aspect ratio ~: 1.361111112

  /** Atlas image aspect ratio - needed when recomputing new atlas size */
  ATLAS_AR: 1.361111111112,

  /** Resizes a atlas to fit its container, keeping aspect ratio */
  resizeToFit: function() {
    let element = this.$();
    let parent = element.parent();
    let parentWidth = parent.width();
    let parentHeight = parent.height();
    let newWidth;
    let newHeight;
    newWidth = parentWidth;
    newHeight = newWidth * (1/this.ATLAS_AR);

    if (newHeight > parentHeight) {
      newHeight = parentHeight;
      newWidth = newHeight * this.ATLAS_AR;
    }

    this.set('width', newWidth);
    this.set('height', newHeight);
  },

  widthChanged: function() {
    this.$().css({
      width: this.get('width'),
      backgroundSize: `${this.get('width')} ${this.get('height')}`
    });
  }.observes('width'),

  heightChanged: function() {
    this.$().css({
      height: (this.get('height')),
      backgroundSize: `${this.get('width')} ${this.get('height')}`
    });
  }.observes('height'),

  centerX: function() {
    return this.get('width')/2;
  }.property('width'),

  centerY: function() {
    return this.get('height')/2;
  }.property('height'),

  didInsertElement() {
    this.$().parents().css('height', '100%');
    this.resizeToFit();
    $(window).resize(() => this.resizeToFit());
  },

  actions: {
    deselectProviders() {
      this.sendAction('deselectProviders');
    }
  }
});
