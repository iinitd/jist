import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import db from './datastore'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import {init as initAuth} from './auth';


if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.prototype.$db = db



Vue.use(ElementUI)

Vue.directive('focus', {
  inserted: function (el) {
      el.focus();
  },
  update: function (el) {
      Vue.nextTick(function() {
            el.focus();
      })
  }
})

store.dispatch('initApp').then(() => {
  const app = new Vue({
    components: { App },
    router,
    store,
    template: '<App/>'
  }).$mount('#app')
  

  initAuth(store);
}, (err) => {
  console.log('Error wile initializing', err);
  // TODO: Warn user but should not occur...
});


// db.insert({"attributes":{"title":"Just hack'n","description":"Nothing to see here","tags":["cat","dog","bat"],"created":1518190381578},"body":"\nCreated at 1518190381578","frontmatter":"title: Just hack'n\ndescription: Nothing to see here\ntags: [ 'cat', 'dog', 'bat' ]\ncreated: 1518190381578"})