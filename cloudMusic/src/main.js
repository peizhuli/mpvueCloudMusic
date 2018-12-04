import Vue from 'vue'
import App from './App'
import MpvueRouterPatch from 'mpvue-router-patch';
import store from './store/store'
// Vue.use(MpvueRouterPatch);
Vue.config.productionTip = false;
App.mpType = 'app'
// App.store = store;
Vue.use({
  install(Vue, options) {
    Vue.prototype.$store = store
    // 不建议在组件内使用，推荐写在src/services目录下
    // Vue.prototype.$wx = $wx
  },
})
const app = new Vue(App)
app.$mount()
