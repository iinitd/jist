import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './actions';
import * as getters from './getters';
import * as types from './mutation-types';
import plugins from './plugins';
import mutations from './mutations';

import moment from 'moment'

// let state = {
//   server: {
//     url: 'https://api.github.com'
//   },
//   session: {
//     access_token: window.localStorage.getItem('access_token'),
//     ready: false,
//     authenticated: false,
//     user: {}
//   },
//   gists:{},
//   gists:{},
//   currentGist:-1,
//   edit_mode: false,
//   update_mode:true,
//   getting_gist_state:true
// };


let state;



if(localStorage.getItem('store')) {
	state = JSON.parse(localStorage.getItem('store'))
} else {
    state = {
    server: {
      url: 'https://api.github.com'
    },
    session: {
      access_token: window.localStorage.getItem('access_token'),
      ready: false,
      authenticated: false,
      user: {}
    },
    delete_task:[],
    gists:{},
    sync_time: moment().toString(),
    currentGist:-1,
    edit_mode: false,
    update_mode:true,
    getting_gist_state:true,
    connection_error:false
  };
}

state.edit_mode = false
state.currentGist = -1,

mutations[types.INIT_SESSION](state);

Vue.use(Vuex);

export default new Vuex.Store({
  state,
  actions,
  getters,
  mutations,
  plugins,
  strict: process.env.NODE_ENV !== 'production'
})