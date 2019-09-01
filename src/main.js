import Vue from "vue";
import App from "./App.vue";
import "./plugins/axios";
import store from "./store";
import router from "./router";

import "bootstrap/dist/css/bootstrap.css";
import "./assets/css/font-awesome-4.7.0/css/font-awesome.min.css";
import "./plugins/element.js";
import "./plugins/addEvent.js";
import './plugins/index.less'

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app");
