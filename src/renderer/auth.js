import {ipcRenderer} from 'electron';

export const init = (store) => {
  ipcRenderer.on('github-oauth-reply', (event, {access_token}) => {
    store.commit('SET_ACCESS_TOKEN', access_token);
    store.dispatch('getUser').then(user => {
      store.commit('AUTHENTICATED', user);
    });
  });
}
