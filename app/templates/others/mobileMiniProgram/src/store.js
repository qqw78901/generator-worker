import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    headImg: '',
    username: '',
  },
  mutations: {
    HEADIMG(context, v){
      const state = context;
      state.headImg = v;
    }, 
    USERNAME(context, v){
      const state = context;
      state.username = v;
    }, 
  },
});

export default store;
