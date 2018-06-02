import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vuex from 'vuex';
import VueFirestore from 'vue-firestore';
import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en'
import 'element-ui/lib/theme-chalk/index.css';

import { db } from './firestore/firebase.js';

import ICN from '@/components/ICN';
import MapMarker from '@/components/MapMarker';

require('@/utils/js-utils.js');
require('@/utils/date-utils.js');
require('@/utils/form-utils.js');
require('@/utils/color-utils.js');

Vue.config.productionTip = false

Vue.component('icn', ICN);
Vue.component('map-marker', MapMarker);
Vue.use(ElementUI, { locale });
Vue.use(Vuex);

new Vue({
  router,
  store,
  data() {
    return store.state;
  },
  render: h => h(App)
}).$mount('#app')


window.db = db;

