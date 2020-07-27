import Vue from "vue";
import Vuex from "vuex";
import { Ability, AbilityBuilder } from "@casl/ability";
import abilityPlugin from "./ability";
import settings from "./modules/settings";
import users from "./modules/users";
import permissions from "./modules/permissions";
import groups from "./modules/groups";
import menus from "./modules/menus";
import { loadLanguageAsync } from "@/locales";

// casl
const TYPE_KEY = Symbol("resourceType");

Vue.use(Vuex);

export const state = {
  rules: [],
  allMenus: [],
  lang: "en-US",
  _antLocale: {}
};

export const mutations = {
  SET(state, payload) {
    state[payload.app] = payload.value;
  },
  SET_ABILITY(state, permission) {
    const { can, rules } = new AbilityBuilder();

    permission.map(perm => {
      can(perm.name);
    });
    state.rules = rules;
  },
  REMOVE_ABILITY(state) {
    state.rules = [];
  },
  SET_ALL_MENU(state, data) {
    state.allMenus = data;
    Vue.ls.set("All-Menu", data);
  },
  CHANGE_LOCALE(state, lang, antd = {}) {
    return new Promise((resolve, reject) => {
      state.lang = lang;
      state._antLocale = antd;
      Vue.ls.set("app_language", lang);

      loadLanguageAsync(lang)
        .then(() => {
          resolve();
        })
        .catch(e => {
          reject(e);
        });
    });
  }
};

export const getters = {
  openKeys(state) {
    return state["menu.openedKeys"] || [];
  },
  selectedKeys(state) {
    return state["menu.selectedKeys"] || [];
  },
  ability() {
    return new Ability([], {
      subjectName(subject) {
        return !subject || typeof subject === "string"
          ? subject
          : subject[TYPE_KEY];
      }
    });
  },
  allMenu(state) {
    return state.allMenus || null;
  },
  accessPermission(state) {
    return Vue.ls.get("Access-Permission") || null;
  },
  locale(state) {
    return state.lang || null;
  }
};

export default new Vuex.Store({
  plugins: [abilityPlugin],
  state,
  mutations,
  getters,
  modules: {
    settings,
    users,
    permissions,
    groups,
    menus
  },
  strict: process.env.NODE_ENV !== "production"
});
