import Ember from 'ember';

let logoFor = function(name, format) {
  format = (format || 'svg');
  return `/assets/images/index/logo-${name}.${format}`;
};

export default Ember.Component.extend({
  /** jQuery element for owl-carousel */
  $owl: null,

  classNames: 'owl-carousel-component',
  tagName: 'div',

  // TODO: link currently not used
  supporters: [
    {
      link: 'http://www.agh.edu.pl',
      image: logoFor('agh')
    },
    {
      link: 'https://www.poig.2007-2013.gov.pl/english',
      image: logoFor('ie'),
      boxClasses: 'background-contain'
    },
    {
      link: 'https://www.indigo-datacloud.eu/',
      image: logoFor('indigo')
    },
    {
      link: 'http://plgrid.pl/',
      image: logoFor('plgrid')
    },
    {
      link: 'https://www.egi.eu/',
      // TODO: the logo is poor quality
      image: logoFor('egi')
    },
    {
      link: 'http://www.cyfronet.krakow.pl/',
      image: logoFor('cyfronet')
    },
    {
      link: 'http://www.browserstack.com/',
      image: logoFor('browserstack')
    },
    {
      link: 'https://www.atlassian.com/software/bamboo',
      image: logoFor('bamboo', 'png')
    }
  ],

  didInsertElement() {
    const $owl = this.set('$owl', this.$('.owl-carousel'));

    const owlCarousel = $owl.owlCarousel({
      autoPlay: 4000,
      items : 6,
      pagination: false,
    });

    // Custom Navigation Events
    this.$('.owl-carousel-arrows .next').click(function() {
      owlCarousel.trigger('next.owl.carousel');
    });

    this.$('.owl-carousel-arrows .prev').click(function() {
      owlCarousel.trigger('prev.owl.carousel');
    });

    this.$('.owl-carousel-arrows').height($owl.height());

    let prevButton = this.$().find('.prev');
    let nextButton = this.$().find('.next');
    [prevButton, nextButton].forEach(button => {
      button.css('margin-top', $owl.height()/2 - button.height()/2);
    });
  }
});
