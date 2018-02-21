import * as types from './mutation-types'
import * as axios from 'axios';
import { ipcRenderer } from 'electron';
import marked from 'marked'
import _ from 'underscore'
import moment from 'moment'

const md = (file) => {

    if (file.filename.indexOf(".md") > -1) {
        return marked(file.raw_content)
    } else {
        const format_raw_content = "```\n" + file.raw_content + "\n```"
        return marked(format_raw_content)
    }

}


const getAxiosClient = (state) => {
    return axios.create({
        baseURL: state.server.url,
        headers: {
            'Authorization': 'token ' + state.session.access_token
        },
        responseType: 'json'
    });
}

export const getToken = ({ commit }) => {
    ipcRenderer.send('github-oauth', 'getToken');
};

export const logout = ({ commit }) => {
    return new Promise(resolve => {
        commit(types.REMOVE_ACCESS_TOKEN);
        commit(types.INIT_SESSION);
        commit(types.REMOVE_USER);
        resolve();
    });
};

export const getUser = ({ commit, state }) => {
    return new Promise((resolve, reject) => {
        getAxiosClient(state)
            .get(`/user`)
            .then(response => {
                commit(types.SET_CONNECTION_ERROR, false);
                commit(types.SET_USER, response.data);
                resolve(response.data);
            }, err => {
                commit(types.SET_CONNECTION_ERROR, true);
                //commit(types.SET_USER, err);
                reject(err);
            });
    });
};

export const getGist = async function({ commit, state }) {

    let response = await getAxiosClient(state).get(`/users/${state.session.user.login}/gists`)
    let gists = response.data
    let gists_in_state = state.gists
    let enhanced_gists = {}
    const time = moment().format()
    for (let i = 0; i < gists.length; i++) {
        let id = gists[i].id
        enhanced_gists[id] = await enhanceGist({
            commit,
            state
        }, gists[i])
        enhanced_gists[id].syncType = "sync"
        enhanced_gists[id].edit_at = time
        enhanced_gists[id].sync_at = time

    }
    await commit(types.SET_GISTS, enhanced_gists);
    await commit(types.SET_GETTING_GIST_STATE, false)
    return enhanced_gists
}

export const postLocalGist = async function({
    commit,
    state
}, gist) {
    gist.syncType = "post"
    gist.id = "Local-" + new Date().getTime();
    gist.edit_at = moment().format()
    for (let f in gist.files) {
        let value = gist.files[f];
        if (value && value.raw_content) {
            gist.files[f].html_content = md(value)
            if (f !== value.filename) {
                let value = gist.files[f];
                gist.files[value.filename] = gist.files[f]
                gist.files = _.omit(gist.files, f)
            };
        } else {
            if (f.indexOf("@new-") > -1) gist.files = _.omit(gist.files, f)
            else gist.files[f] = null
        }
    }

    await commit(types.UPDATE_GIST, gist);
    await commit(types.SET_CURRENTGIST, gist.id);
}

export const patchLocalGist = async function({
    commit,
    state
}, gist) {

    gist.syncType = "patch"
    gist.edit_at = moment().format()
    for (let f in gist.files) {
        let value = gist.files[f];
        if (value && value.raw_content) {
            gist.files[f].html_content = md(value)
            if (f !== value.filename) {
                let value = gist.files[f];
                gist.files[value.filename] = gist.files[f]
                gist.files = _.omit(gist.files, f)
            };
        } else {
            if (f.indexOf("@new-") > -1) gist.files = _.omit(gist.files, f)
            else gist.files[f] = null
        }
    }

    await commit(types.UPDATE_GIST, gist);
    await commit(types.SET_CURRENTGIST, gist.id);

}

export const deleteLocalGist = async function({
    commit,
    state
}, id) {
    await commit(types.SET_CURRENTGIST, -1);
    if (id.indexOf("Local") == -1)
        await commit(types.ADD_DELETE_TASK, id);
    await commit(types.REMOVE_GIST, id)
    return id
};

export const syncToGithub = async function({ commit, state }) {

    commit(types.SET_CONNECTION_ERROR, false);


    try {

        let deleteTask = state.delete_task
        for (let i = 0; i < deleteTask.length; i++) {

            let res = await deleteGist({
                commit,
                state
            }, deleteTask[i])

            console.log(res)

            if (res.status == "404") await commit(types.CLEAR_DELETE_TASK, deleteTask[i])

        }

        //await commit(types.CLEAR_DELETE_TASK)


        let gists = state.gists
        let time = moment().format()
        for (let key in gists) {

            let gist = gists[key]

            if (!gist.sync_at || moment(gist.edit_at).diff(moment(gist.sync_at)) > 0) {
                let response;
                if (gist.id.indexOf('Local') > -1) {

                    response = await postGist({
                        commit,
                        state
                    }, gist)
                } else {

                    response = await patchGist({
                        commit,
                        state
                    }, gist)
                }
                // if (response.status == '200') {
                //     await commit(types.SYNC_GIST, { id: gist.id, time })
                // }
            }

            await commit(types.SET_SYNC_TIME, time)

        }
        return true

    } catch (e) {
        commit(types.SET_CONNECTION_ERROR, true);
    }

};

export const patchGist = async function({
    commit,
    state
}, gist) {

    let time = moment().format()

    let request = {
        description: JSON.stringify(gist.description),
        files: {}
    };

    for (let f in gist.files) {

        let value = gist.files[f];

        if (value && value.raw_content) {

            request.files[value.filename] = {
                filename: value.filename,
                content: "" + value.raw_content
            };

        } else {

            request.files[f] = null

        }

    }

    let raw_response = await getAxiosClient(state).patch(`/gists/${gist.id}`, request)
    await commit(types.SYNC_GIST, { id: gist.id, time })
    await commit(types.REMOVE_NULL_FILE, gist.id);
    // let enhanced_response = await await enhanceGist({   commit,   state
    // },raw_response.data) await commit(types.UPDATE_GIST, enhanced_response);
    // await commit(types.SET_CURRENTGIST, enhanced_response.id);
    return raw_response
};

export const getSingleGist = ({
    commit,
    state
}, url) => {
    return new Promise((resolve, reject) => {
        axios
            .get(url)
            .then(response => {
                resolve(response.data);
            }, err => {
                console.log(err);
                reject(err);
            });
    });
};

export const postGist = async function({
    commit,
    state
}, gist) {

    let time = moment().format()


    let request = {
        description: JSON.stringify(gist.description),
        files: {},
        public: false
    };

    for (let f in gist.files) {

        let value = gist.files[f];

        if (value && value.raw_content) {

            request.files[value.filename] = {
                filename: value.filename,
                content: "" + value.raw_content
            };

        }

    }
    let post_response = await getAxiosClient(state).post(`/gists`, request)
        // let enhanced_response = await await enhanceGist({   commit,   state },
        // post_response.data)
    let old_id = gist.id
    let new_gist = post_response.data
    new_gist.description = gist.description
    new_gist.files = gist.files
    await commit(types.SYNC_GIST, { id: gist.id, time })
    await commit(types.UPDATE_GIST, new_gist);
    await commit(types.REMOVE_GIST, old_id);
    return post_response
};

export const deleteGist = async function({
    commit,
    state
}, id) {
    try {
        let raw_response = await getAxiosClient(state).delete(`/gists/${id}`)
        await commit(types.SET_CURRENTGIST, -1);
        await commit(types.REMOVE_GIST, id)
        return raw_response

    } catch (e) {

        return e.response

    }

};

const downloadGistFiles = (files) => {

    let promiseArr = Object
        .values(files)
        .map((f) => {
            return new Promise((resolve, reject) => {
                if (f.raw_content) {
                    resolve(f)
                } else {
                    axios
                        .get(f.raw_url)
                        .then(response => {
                            f.raw_content = response.data
                            f.html_content = md(f)
                            resolve(f);
                        }, err => {
                            console.log(err);
                            reject(err);
                        });
                }
            })
        })
    return Promise
        .all(promiseArr)
        .then((arr) => {
            let obj = {}
            arr.forEach((a) => {
                obj[a.filename] = a
            })
            return obj
        })

}

export const getSingleGistContent = ({
    commit,
    state
}, files) => {

    return downloadGistFiles(files)

};

export const initApp = ({ commit, state }) => {
    return new Promise(resolve => {
        if (!state.session.access_token) {
            return resolve();
        }

        getUser({ commit, state }).then(user => {
            commit(types.SET_USER, user);
            commit(types.AUTHENTICATED, user);
            resolve();
        }, err => {
            console.log('Error while getting user from github, user will have to login', err);
            resolve();
        });
    });
};

export const setCurrentGist = ({
    commit,
    state
}, gist) => {
    return new Promise((resolve, reject) => {
        commit(types.SET_CURRENTGIST, gist)
        resolve(gist)
    });
};

export const enhanceGist = ({
    commit,
    state
}, gist) => {
    return downloadGistFiles(gist.files).then((filesWithContent) => {
        if (Object.prototype.toString.call(gist.description) === "[object String]") {
            try {
                gist.description = JSON.parse(gist.description);
            } catch (e) {
                gist.description = {
                    title: gist.id,
                    tags: "",
                    description: gist.description
                };
            }
        }
        gist.files = filesWithContent
            //commit(types.UPDATE_GIST, {id:idx,gist:gist})
        return gist
    })
};