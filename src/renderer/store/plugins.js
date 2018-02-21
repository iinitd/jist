import createLogger from 'vuex/dist/logger';
//import db from '../datastore'

const localStoragePlugin = store => {
  store.subscribe((mutation, { session }) => {
    if (session.access_token) {
      window.localStorage.setItem('access_token', session.access_token);
    } else {
      window.localStorage.removeItem('access_token');
    }
  })
}

const persistPlugin =  store => {
  store.subscribe((mutation, state) => {
    // Store the state object as a JSON string

    localStorage.setItem('store', JSON.stringify(state));
  });
}


export default process.env.NODE_ENV !== 'production'
  ? [createLogger(), localStoragePlugin,persistPlugin]
  : [localStoragePlugin,persistPlugin]