import Vue from 'vue';
import store from '@/store';
import App from '@/App';
import { 
    onShareAppMessage,
} from "@/common";

Vue.prototype.$store = store;
Vue.config.productionTip = false;

// 所有页面共用onShareAppMessage
Vue.mixin({
  onShareAppMessage
});

App.mpType = 'app';

const app = new Vue(App);
app.$mount();
