import Vue from "vue";
import store from "@/store";

export default function Init() {
  store.commit("CHANGE_LOCALE", Vue.ls.get("app_language", "vi-VN"));

  console.log(`API_URL: ${process.env.VUE_APP_GRAPHQL_URI}`);
}
