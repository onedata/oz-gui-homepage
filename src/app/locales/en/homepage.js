import httpStatusPage from './components/http-status-page';

export default {
  application: {
    homepage: 'homepage',
    onezone: 'manage account',

    getStarted: 'get started',
    documentation: 'documentation',
    community: 'community',
    download: 'download',
    support: 'support',
    media: 'media',
    blog: 'blog',
    api: 'API',
  },
  components: {
    httpStatusPage,
  },
  index: {
    atlas: {
      subtitle: 'Global data access solution for science',
      text: 'Have the best of both worlds! Perform heavy computations on huge datasets. ' +
        'Access your data in a dropbox-like fashion regardless of its location. ' +
        'Publish and share your results with public or closed communities.',
      getStarted: 'Get started'
    },
    whatIs: {
      title: 'What is onedata?',
      text: 'High-performance data management solution that offers unified data access ' +
        'across globally distributed environments and multiple types of underlying ' +
        'storage, allowing users to share, collaborate and perform computations on ' +
        'the stored data easily.'
    },
    why: {
      title: 'Why onedata?',
      virtualized: {
        title: 'Virtualized data access',
        text: 'Single virtual storage on top of multiple physical file systems ' +
          'distributed over any type of storage.'
      },
      performance: {
        title: 'High performance',
        text: 'Direct, block level data access and on-the-fly data prefetching ' +
          'allow for efficient data intensive computations.'
      },
      infrastructure: {
        title: 'Infrastructure flexibility',
        text: 'Tailored for Cloud, Grid, HPC and Desktop environments; compatible ' +
          'with enterprise-grade Linux distributions.'
      },
      opendata: {
        title: 'Support for open data',
        text: 'Easy sharing of large datasets with dedicated users of publishing ' +
          'them as open data.'
      }
    },
    join: {
      title: 'Join onedata',
      user: {
        title: 'Become a user',
        text: 'Enjoy anytime, anyplace access to your data with easy collaboration ' +
          'and support for high-performance computations.'
      },
      provider: {
        title: 'Become a provider',
        text: 'Support global scientific research with your storage resources.'
      }
    },
    forResearchers: {
      title: 'For researchers by researchers!',
      text: 'Developed in a scientific community with hands-on experience in Grids, ' +
        'data-intensive applications and storage systems with quality of ' +
        'service guarantees. Our system strives to fill the gap between ' +
        'science oriented, well-served data solutions and consumer-grade' +
        'cloud storage services.'
    },
    whoSupports: {
      title: 'Who supports us?'
    },
    knowMore: {
      title: 'Want to know more? Talk to us',
      privacy: 'Privacy',
      tos: 'ToS',
      copyright: '&copy; 2018 Onedata.org'
    }
  },
  support: {
    supportAreaTitle: 'Support area',
    bugReport: {
      title: 'Bug report',
      text: 'Onedata uses GitHub for bug tracking',
      reportProblemLink: 'report a problem in Onedata'
    },
    dedicatedSupport: {
      title: 'Dedicated support',
      introMayApply: 'Organizations using onedata may apply for a dedicated support including',
      bulletConfiguring: 'configuring and performance tuning by our experts',
      bulletImplementing: 'implementing additional functionalities',
      bulletAdopting: 'adopting to organization\'s needs',
      bulletSolving: 'solving problems',
      contactUs: 'Contact us',
      contactForMore: '{{link}} for more information'
    }
  },
  api: {
    title: 'API',
    stable: 'stable',
    showApi: {
      loading: 'Loading',
    },
  }
};
