import sessionLocales from 'ember-cli-onedata-common/locales/en/session';

export default {
  common: {
    fetchingToken: 'Fetching token...',
    loading: 'Loading...',
    loadingNamed: 'Loading {{name}}...',
    modal: {
      ok: 'OK',
      cancel: 'Cancel',
      yes: 'Yes',
      no: 'No',
      signin: 'Sign in',
      join: 'Join'
    },
    notify: {
      clipboardSuccess: 'Text has been copied to clipboard.',
      clipboardFailue: 'Text cannot be copied to clipboard - please copy it manually'
    },
    serverError: 'Server error',
    unknownError: 'Unknown error',
    fatalApplicationErrorResources: "A fatal error occured loading application's resources"
  },
  services: {
    session: sessionLocales,
    spacesManager: {
      leaveModal: {
        title: 'Leave a space',
        label: 'Are you sure you want to leave space "{{spaceName}}"?',
        success: 'Space "{{spaceName}}" has been left successfully',
        failure: 'Failed to leave space "{{spaceName}}"'
      },
      renameModal: {
        title: 'Rename a space',
        label: 'Enter new name for space "{{spaceName}}":',
        success: 'Space "{{oldName}}" has been renamed to "{{newName}}"',
        failure: 'Failed to rename space "{{oldName}}": {{errorMessage}}'
      }
    }
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
      },
      unsupportSpace: {
        title: 'Unsupport space',
        bodyQuestion: 'Are you sure you want to cease support of ' +
        'provider "{{providerName}}" for space "{{spaceName}}"?',

        bodyInfo: 'This operation can cause irreversible loss of your data. ' +
        'To prevent data loss, make sure all the data in the space is ' +
        'replicated to other providers of the space. If this is the only ' +
        'provider for this space, all data will be lost. ',

        bodySureQuestion: 'Are you sure you want to proceed?',

        confirmCheckbox: 'I understand the risk of data loss',

        unsupportSpaceSuccess: 'Space "{{spaceName}}" unsupported successfully',
        unsupportSpaceFailed: 'Cannot unsupport space:'
      },
      joinSpace: {
        title: 'Join a space',
        label: 'Enter a token of a space to join:',
        joinSuccess: 'Successfully joined space "{{spaceName}}"',
        joinFailed: 'Cannot join space: "{{errorDetails}}"',
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
    },
    accountsList: {
      loadingAccounts: 'Loading accounts info...',
      loadingSupportedAuthorizers: 'Loading supported authorizers...',
    },
    spaceSettingsDrop: {
      setHome: 'set as home',
      leave: 'leave',
      rename: 'rename',
      getSupport: 'get support'
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
        'a space. To get support, go to "{{manageDataSpacesTitle}}" menu, get a ' +
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
      manageGroupsHead: 'groups management',
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
      spacesList: 'spaces list',
      createNewSpace: 'Create new space',
      createNewSpaceText: 'You can also become a provider yourself and support ' +
      'your own space.',
      joinSpace: 'Join a space',
      readMore: 'Read more',
      noViewPermissions: 'You do not have privileges to view details of this space.',
    },
    spacesAccordionItem: {
      getSupport: 'Get support',
      toggleDefaultFailed: 'Changing default space failed: {{errorMessage}}'
    },
    providersAccordion: {
      providersList: 'providers list',
      chooseProvider: 'Choose Provider',
      noProviders: 'No providers, get support first.'
    },
    providersAccordionItem: {
      toggleDefaultFailed: 'Changing default provider failed: {{errorMessage}}'
    },
    tokensAccordion: {
      tokensList: 'tokens list',
      createNewToken: 'Create new access token',
      info: 'Generate new token to get access to Onedata using command line client or REST API'
    },
    tokensAccordionItem: {},
    providerPlaceDrop: {
      offline: 'offline',
      goToFiles: 'Go to your files',
      goToFilesErrorMessage: 'Could not fetch URL of selected provider',
      hostnameCopySuccess: 'Provider hostname copied to clipboard',
      hostnameCopyError: 'Failed to copy hostname to clipboard - please do it manually'
    },
    aliasPanel: {
      noAlias: 'You have no alias',
      userAlias: 'user alias'
    }
  }
};
