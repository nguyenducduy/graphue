import Vue from "vue";
import store from "@/store";

export default function Init() {
  // init default language
  store.commit("CHANGE_LOCALE", Vue.ls.get("app_language", "en-US"));

  console.log(`API_URL: ${process.env.VUE_APP_GRAPHQL_URI}`);
}
