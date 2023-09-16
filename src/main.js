import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/utils/global';
import router from "@/routers/router.js";
import axios from 'axios'
import VueAxios from 'vue-axios'
import '@/styles/index.scss'

Vue.use(ElementUI)

axios.defaults.baseURL = '/v1/api'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8;application/json'

Vue.use(VueAxios, axios)
Vue.config.productionTip = false


new Vue({
  render: h => h(App),
  router: router,
  components: {App},
  template: '<App/>'
}).$mount('#app')
