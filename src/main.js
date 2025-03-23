import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/vant.js'

// 定义特性标志
window.__VUE_PROD_DEVTOOLS__ = false;
window.__VUE_PROD_HYDRATION_MISMATCH_DETAILS__ = false;

import axiosPlugin from '@/axios/axiosPlugin';
import {
    baseURL
} from '@/config.js';
import Vant from "vant";

const app = createApp(App);

app.use(axiosPlugin);
app.use(router);
app.use(Vant);

app.config.productionTip = false;
app.config.globalProperties.businessServer = baseURL + "/";
app.config.globalProperties.devicesFlag = navigator.userAgent.indexOf("Html5Plus") > -1;

app.mount('#app');