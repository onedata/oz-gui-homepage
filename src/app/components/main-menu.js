import Ember from 'ember';
import snakeToCamel from '../utils/snake-to-camel';

export default Ember.Component.extend({
  tagName: 'ul',
  classNames: 'nav navbar-nav application-nav',
  menuItems: [],
  setupMenuItems: function() {
    let itemNames = [
      //'get-started',
      'documentation',
      //'community',
      //'download',
      //'support',
      //'media',
      //'blog',
      'login'
    ];

    let menuItems = itemNames.map((name) => {
      return {
        linkTo: `home.${name}`,
        titleI18n: `application.${snakeToCamel(name)}`,
        showAuthenticated: true,
        showUnauthenticated: true,
      };
    });

    menuItems.filter((i) => i.linkTo === 'home.login').forEach((i) => {
      i.showAuthenticated = false;
    });

    let docItem = menuItems.find((i) => i.linkTo === 'home.documentation');
    if (docItem) {
      docItem.url = '/docs/index.html';
    }

    menuItems.forEach((i) => {
      console.log(i.linkTo + ' ' + i.url);
    });

    this.set('menuItems', menuItems);
  }.on('init')

});
