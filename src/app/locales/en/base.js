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
      join: 'Join',
      close: 'Close',
    },
    notify: {
      clipboardSuccess: 'Text has been copied to clipboard.',
      clipboardFailue: 'Text cannot be copied to clipboard - please copy it manually'
    },
    serverError: 'Server error',
    unknownError: 'Unknown error',
    fatalApplicationErrorResources: "A fatal error occured loading application's resources",
    or: 'or',
    back: 'Back'
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
        "existing account and use the option 'Link new account' in Authentication Settings.",
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
    formSubtitle: 'Using your Onepanel account',
    formSubtitleTip: 'This login method is available for administrators and special users ' +
      'created via onepanel administrative interface. Regular users must login via social or ' +
      'institutional accounts, which can be found in previous menu.',
    noProvidersFormSubtitleTip: 'This login method is available for administrators and special ' + 
      'users created via onepanel administrative interface. Regular users must login via social or ' + 
      'institutional accounts, which are currently disabled by the administrators of this zone.',
    dropdownSubtitle: 'A new account will be created automatically on first login',
    isolatedZone: 'isolated zone',
    unknownZoneName: 'unknown',
    loginWith: 'Login with',
    loginUsing: 'Login using ',
    onepanelAccount: 'Onepanel account',
    showMore: 'Show all identity providers',
    findProviderPlaceholder: 'Find your identity provider...',
    version: 'version',
    authenticationError: {
      title: 'Authentication error',
      addAccountTitle: 'Cannot add account',
      backToLogin: 'Back to login',
      // NOTE: if adding translation here, don't forget to add new message type to
      // mixins/authentication_error_messages
      codes: {
        server_error: 'Server has encountered an unexpected error while processing ' +
        'your login request. Please contact site administrators if the problem persists.',
        invalid_state: 'Login failed due to bad request state - this usually ' + 
          'happens when you do not complete your login process within 60 seconds ' +
          'since redirection to chosen identity provider.',
        invalid_request: 'Your login request could not be validated. Please ' +
          'contact site administrators if the problem persists.',
        account_already_linked_to_another_user: 'You cannot link this account because it ' +
          'is already linked to another user profile.',
        account_already_linked_to_current_user: 'This account is already linked ' +
          'to your profile.',
        access_token_invalid: 'Chosen identity provider has issued an invalid access token. This can be caused by a misconfiguration of the identity provider or an expired session. Try to sign out from it and repeat the login process.',
        unknown: 'Unknown reason.'
      }
    },
  },
  components: {
    modals: {
      addSpaceStorage: {
        title: 'Add storage for',
        requestSupport: {
          tabName: 'Request support',
          desc1: 'Request storage support for this space from existing provider.',
          desc2: 'Pass the token below to the administrator of the preferred ' + 
            'storage provider (e.g. via email).',
          desc3: 'Each token can only be used once.',
        },
        exposeData: {
          tabName: 'Expose existing data collection',
          desc1: 'Expose storage with an existing data set through this space.',
          desc2: 'Existing directories and files structure will be ' +
            'automatically discovered and synchronized, allowing any member of ' +
            'this space to access the data set.',
        },
        deployProvider: {
          tabName: 'Deploy your own provider',
          desc1: 'Deploy your own Oneprovider service and automatically support ' +
            'this space using your storage.',
        },
        tabsCommon: {
          descDistros: 'The following Linux distributions are supported:',
          descCommand: 'The following command installs docker and configures ' +
            'a dockerized Oneprovider instance.',
          token: 'Token',
          command: 'Command',
          generateToken: 'Generate another token',
        },
      },
      loginForm: {
        title: 'Login with username and password',
        usernameLabel: 'Username',
        passwordLabel: 'Password',
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
      },
      joinGroup: {
        title: 'Join a group',
        label: 'Enter a token of a group to join:',
        joinSuccess: 'Successfully joined group "{{groupName}}"',
        joinFailed: 'Cannot join group: "{{errorDetails}}"',
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
      getSupport: 'add storage'
    }
  },
  logout: {
    failed: 'Session invalidation failed - cannot logout'
  },
  onezone: {
    title: 'Manage account',
    version: 'version',

    providerRedirect: {
      error: 'We are sorry, but URL for provider cannot be resolved',
      redirecting: 'Redirecting to provider',
    },
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
        intro: 'To store data, you need to belong to a space that is supported by at least one provider. ' +
          'There are three ways to achieve this:',
        space: 'space',
        group: 'group',
        invitationToken: 'invitation token',
        p1_1: 'Visit a',
        p1_2: 'tab, get a support token for one of your spaces (you can create one at this point) and pass it to a provider of your choice, asking for support',
        pIfYouHave: 'If you have a',
        pVisit: 'visit',
        p2_2: 'tab and join an existing space',
        p3_2: 'tab and join a group to gain access to spaces of that group'
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
      connectHead: 'Authentication settings',
      manageSpacesHead: 'Data space management',
      manageGroupsHead: 'Group management',
      filesHead: 'Go to your files',
      tokensHead: 'Access tokens',
      aliasHead: 'User alias'
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
      connectNewAccount: 'Link new account',
      connectBy: 'Connect by'
    },
    groupsList: {
      joinGroup: 'Join a group',
    },
    spacesAccordion: {
      spacesList: 'spaces list',
      createNewSpace: 'Create new space',
      createNewSpaceText: 'You can also become a provider yourself and support ' +
      'your own space.',
      joinSpace: 'Join a space',
      readMore: 'Read more',
      noViewPermissions: 'You do not have privileges to view details of this space.',
      creatingSpace: 'Creating space:',
    },
    spacesAccordionItem: {
      getSupport: 'Add storage...',
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
      pending: 'verifying...',
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
