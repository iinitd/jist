module.exports = {
    sources: {
      repoUrl: ''
    },
    oauth: {
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
      authorizationUrl: 'https://github.com/login/oauth/authorize',
      tokenUrl: 'https://github.com/login/oauth/access_token',
      useBasicAuthorizationHeader: false,
      // don't touch me
      redirectUri: 'http://localhost'
    }
  };
  