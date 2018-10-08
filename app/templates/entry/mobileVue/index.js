import '../css/index.scss';
import Vue from 'vue';
import App from '../App.vue';

window.FastClick.attach(document.body);
/**if you need,pick it */
/**
 * 
Vue.prototype.$clickStat = (eid, eidDesc) => {
    f2eGame.port.statpid.clickStat({
        eid,
        eid_desc: eidDesc
    });
};
 */

new Vue({
    el: '#app',
    render: h => h(App)
});
