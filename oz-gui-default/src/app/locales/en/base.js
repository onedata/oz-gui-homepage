import sessionLocales from './session';

export default {
  common: {
    fetchingToken: 'Fetching token...',
    loading: 'Loading...',
    modal: {
      ok: 'OK',
      cancel: 'Cancel',
      signin: 'Sign in'
    },
    serverError: 'Server error',
    fatalApplicationErrorResources: "A fatal error occured loading application's resources"
  },
  services: {
    session: sessionLocales
  },
  application: {
    title: 'Onezone',

    login: 'login',
    logout: 'logout',

    openidErrors: {
      title: 'Cannot connect account',
      openidInvalidRequest: "Request to OpenID was invalid",
      newAccountEmailOccupied:
        "One or more e-mail addresses returned by the OpenID provider are already " +
        "occupied. The system requires that emails are unique and connected to one " +
        "user. To add this OpenID account to your existing account, login on the " +
        "existing account and use the option 'Connect new account' in Authentication Settings.",
      connectAccountEmailOccupied:
        "One or more e-mail addresses returned by the OpenID provider are already " +
        "connected to another account. The system requires that emails are unique " +
        "and connected to one user, unfortunately two different accounts cannot be merged.",
      connectAccountAlreadyConnected:
        "This OpenID account is already connected to another user account. " +
        "Unfortunately two different accounts cannot be merged."
    }
  },
  login: {
    title: 'Login',

    boxTitle: 'login',
    boxSubtitle: 'A new account will be created automatically on first login',
    unknownZoneName: 'unknown'
  },
  components: {
    modals: {
      loginForm: {
        title: 'Login with username and password',
        usernameLabel: 'Username:',
        passwordLabel: 'Password:',
        error: 'Authentication error:',
        success: 'Authenticated successfully!'
      },
      changePassword: {
        title: 'Change your password',
        oldPasswordLabel: 'Current password:',
        newPasswordLabel: 'New password:',
        retypeNewPasswordLabel: 'Retype new password:',
        error: 'Cannot change password due to an error:',
        success: 'Password changed successfully!',
        passwordMatchError: 'New passwords do not match'
      }
    },
    socialBoxList: {
      error: {
        title: 'Server error',
        message: 'Getting authentication endpoint failed'
      },
      fetchProvidersFailed: 'Server error - fetching login providers failed',
      fetchProvidersFailedUnknown: 'unknown reason'
    },
    aliasPanel: {
      getAliasFailed: 'Getting alias failed',
      setAliasFailed: 'Setting alias failed'
    },
    accountAdd: {
      errorGettingUrl: 'Error getting url to authorizer'
    }
  },
  logout: {
    failed: 'Session invalidation failed - cannot logout'
  },
  onezone: {
    title: 'Manage account',

    messages: {
      noneProviders: {
        title: 'All your providers are offline',
        text: 'Currently, all the providers that support your spaces ' +
        'are offline. This means that you cannot get access to your files ' +
        'until they come back online. If you get additional support for your' +
        'space you will be able to use it but you will not see the files that' +
        'are stored in offline providers. You can also create new spaces ' +
        'and ask for support.'
      },
      getSupport: {
        title: 'Get support',
        text: 'Currently, none of your spaces is supported by any provider. ' +
        'You need support from at least one provider to store data in ' +
        'a space. To get support, go to "Manage Data Spaces" menu, get a ' +
        'support token for chosen space and pass it to a provider of your choice.'
      },
      firstLogin: {
        title: 'First login',
        p1: 'You have successfully logged in and an account for you has been created.',
        p2: 'You are now on account management page. Here, you can connect other ' +
        'accounts to your profile, modify your user data, manage your spaces' +
        'and providers.',
        p3: 'We have created a default space for you. You need to find a ' +
        'provider that will support it before you can store your files.'
      }
    },
    sidebar: {
      connectHead: 'authentication settings',
      manageSpacesHead: 'data space management',
      filesHead: 'go to your files',
      tokensHead: 'access tokens',
      aliasHead: 'user alias'
    },
    topBar: {
      manageProviders: 'manage account',
      enableHints: 'enable hints'
    },
    accountsList: {
      loading: 'Loading accounts info...'
    },
    accountItemPassword: {
      changePassword: 'Change your password'
    },
    accountAdd: {
      connectNewAccount: 'Connect new account',
      connectBy: 'Connect by'
    },
    spacesAccordion: {
      createNewSpace: 'Create new space',
      createNewSpaceText: 'You can also become a provider yourself and support ' +
      'your own space.',
      readMore: 'Read more'
    },
    spacesAccordionItem: {
      getSupport: 'Get support'
    },
    providersAccordion: {
      chooseProvider: 'Choose Provider',
      noProviders: 'No providers, get support first.'
    },
    providersAccordionItem: {},
    tokensAccordion: {
      createNewToken: 'Create new access token',
      info: 'Generate new token to get access to Onedata using command line client or REST API'
    },
    tokensAccordionItem: {},
    providerPlaceDrop: {
      operable: 'Operable',
      inoperable: 'Inoperable',
      goToFiles: 'Go to your files',
      goToFilesErrorMessage: 'Could not fetch URL of selected provider'
    },
    aliasPanel: {
      noAlias: 'You have no alias'
    }
  }
};
