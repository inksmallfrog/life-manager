import './lib/polyfill.js';

import './fonts/iconfont.css';
import './styles/monokai-sublime.css';

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuex from 'vuex'
import App from './App';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

document.addEventListener('dragleave', (e)=>e.preventDefault(), false);
document.addEventListener('drop', (e)=>e.preventDefault(), false);
document.addEventListener('dragenter', (e)=>e.preventDefault(), false);
document.addEventListener('dragover', (e)=>e.preventDefault(), false);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
});
