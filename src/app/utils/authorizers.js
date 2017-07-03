/**
 * Provides list of predefined authorization providers with neccessary 
 * data to display them (name, logo - icon or image).
 * @module utils/authorizers
 * @author Michal Borzecki
 * @copyright (C) 2017 ACK CYFRONET AGH
 * @license This software is released under the MIT license cited in 'LICENSE.txt'.
 */

/**
 * @typedef {Object} AuthorizerInfo
 * @property {string} type
 * @property {string} name authorizer name to display
 * @property {string} iconType 'oneicon' or any image file extension
 * @property {string} iconName oneicon character name of file name 
 * (without extension)
 */

export default [{
    type: 'basicAuth',
    iconType: 'oneicon',
    iconName: 'key',
  },
  {
    type: 'indigo',
    name: 'Indigo',
    iconType: 'oneicon',
    iconName: 'social-indigo',
  },
  {
    type: 'google',
    name: 'Google+',
    iconType: 'oneicon',
    iconName: 'social-google',
  },
  {
    type: 'facebook',
    name: 'Facebook',
    iconType: 'oneicon',
    iconName: 'social-facebook',
  },
  {
    type: 'github',
    name: 'GitHub',
    iconType: 'oneicon',
    iconName: 'social-github',
  },
  {
    type: 'dropbox',
    name: 'Dropbox',
    iconType: 'oneicon',
    iconName: 'social-dropbox',
  },
  {
    type: 'plgrid',
    name: 'PLGrid OpenID',
    iconType: 'oneicon',
    iconName: 'social-plgrid',
  },
  {
    type: 'egi',
    name: 'EGI',
    iconType: 'oneicon',
    iconName: 'social-egi',
  },
  {
    type: 'elixir',
    name: 'ELIXIR',
    iconType: 'svg',
    iconName: 'elixir'
  },
  {
    type: 'rhea',
    name: 'RHEA KeyCloak',
    iconType: 'oneicon',
    iconName: 'social-rhea',
  },
];
