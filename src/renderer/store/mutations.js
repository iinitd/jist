import * as types from './mutation-types';
import _ from 'underscore'

export default {
  [types.SET_USER](state, user) {
    state.session.user = user;
  },

  [types.SET_GISTS](state, gists) {
    state.gists = gists
  },

  [types.SET_GETTING_GIST_STATE](state, value) {
    state.getting_gist_state = value
  },

  [types.REMOVE_GIST](state, id) {
    state.gists = _.omit(state.gists, id);
  },

  [types.SET_CURRENTGIST](state, gist) {
    state.currentGist = gist
  },

  [types.SET_ACCESS_TOKEN](state, token) {
    state.session.access_token = token;
  },

  [types.REMOVE_ACCESS_TOKEN](state) {
    state.session.access_token = false;
  },

  [types.UPDATE_GIST](state, gist) {
    state.gists = {

      ...state.gists,
      [gist.id]: gist

    }
  },

  [types.SYNC_GIST](state, {id,time}) {
    state.gists[id].syncType = "sync"
    state.gists[id].sync_at = time
  },

  [types.ADD_DELETE_TASK](state, id) {
    state.delete_task.push(id)
  },

  [types.CLEAR_DELETE_TASK](state,id) {
    state.delete_task = _.omit(state.delete_task,id)
  },

  [types.DELETE_FILE](state,{id,filename}) {
    if(!state.gists[id].delete_files){
      state.gists[id].delete_files = []
    }
    state.gists[id].delete_files.push(filename)
  },

  [types.REMOVE_NULL_FILE](state,id) {
    for(let f in state.gists[id].files){
      let value = state.gists[id].files[f]
      if(!value){
        state.gists[id].files =  _.omit(state.gists[id].files, f);
      }
    }
  },
  
  [types.SET_SYNC_TIME](state,time) {
    state.sync_time = time
  },

  [types.REMOVE_USER](state) {
    state.session.user = {};
  },

  [types.SET_EDIT_MODE](state, value) {
    state.edit_mode = value;
  },

  [types.SET_CONNECTION_ERROR](state, value) {
    state.connection_error = value;
  },

  [types.SET_UPDATE_MODE](state, value) {
    state.update_mode = value;
  },

  [types.AUTHENTICATED](state) {
    state
      .session
      .authenticated();
  },

  [types.INIT_SESSION](state) {
    let authenticated;
    const authPromise = new Promise((resolve, reject) => {
      authenticated = resolve;
    });

    state.session.ready = authPromise;
    state.session.authenticated = authenticated;
  }
}