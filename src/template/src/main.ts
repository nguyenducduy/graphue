// with polyfills
import "core-js/stable";
import "regenerator-runtime/runtime";

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import i18n from "./locales";
import bootstrap from "./core/bootstrap";
import "./core/lazy_use";
import fetch from "@/helper/fetch";
import { abilitiesPlugin } from "@casl/vue";
import NProgress from "vue-nprogress";
// import PouchDB from 'pouchdb'

// casl init
Vue.use(abilitiesPlugin, store.getters.ability);

//nprogress
Vue.use(NProgress);
const nprogress = new NProgress({
  easing: "ease",
  speed: 500,
  showSpinner: false
});

//axios
Vue.use(fetch);

Vue.config.productionTip = false;

new Vue(
  {
    nprogress,
    router,
    store,
    i18n,
    created: bootstrap,
    render: h => h(App),
    mounted: () => {
      // let db = new PouchDB('adminDb')
      // db.get('currUser').then(doc => {
      //   this.$store.commit('account/setUser', doc.user)
      // })
    }
  } as any //wrap as any to fix nprogress type
).$mount("#app");
