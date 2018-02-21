export const isAuthenticated = (state) => {
  return !!state.session.access_token;
};

export const username = (state) => {
  return state.session.user.login ? state.session.user.login : '';
}

export const avatarUrl = (state) => {
  return state.session.user.avatar_url ? state.session.user.avatar_url:require('../assets/github.png');
}

export const onAuthenticated = (state) => {
  return state.session.ready;
}

export const accessToken = (state) => {
  return state.session.access_token;
}

export const gists = (state) => {
  return state.gists;
}