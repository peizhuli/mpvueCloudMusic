/**
 * Created by Y on 2018/10/25.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations';
import actions from './actions';
import state from './state';
import getters from './getters';
Vue.use(Vuex);

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
});
