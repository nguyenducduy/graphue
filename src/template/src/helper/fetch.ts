import axios from "axios";
import Vue from "vue";

const baseUri = process.env.VUE_APP_REST_URI;

function createInstance(baseURL) {
  return axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json"
      // Authorization: `Bearer ${localStorage.token}`,
    }
  });
}

export default {
  install() {
    Vue.prototype.$http = createInstance(baseUri);
  }
}; // Check debug/build mode
