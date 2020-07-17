import Vue from "vue";
import Vuex from "vuex";
import { Ability, AbilityBuilder } from "@casl/ability";
import abilityPlugin from "./ability";
import settings from "./modules/settings";
import users from "./modules/users";
import permissions from "./modules/permissions";
import groups from "./modules/groups";
import * as Case from "case";

// casl
const TYPE_KEY = Symbol("resourceType");

Vue.use(Vuex);

export const state = {
  rules: []
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
    groups
  },
  strict: process.env.NODE_ENV !== "production"
});
