import Vue from "vue";
import graphqlClient from "@/helper/apollo";
import {
  LIST_MENU,
  GET_MENU,
  CREATE_MENU,
  UPDATE_MENU,
  DELETE_MENU
} from "@/graphql/menus";

const state: any = {
  item: null,
  items: []
};

const mutations: any = {
  SET_MENU(state, data) {
    state.item = data;
  },
  SET_MENU_LIST(state, data) {
    if (typeof data.node !== "undefined") {
      state.items = [data["node"]];
    }
  }
};

const actions: any = {
  async fetchAll({ commit }, variables) {
    const response = await graphqlClient.query({
      query: LIST_MENU
    });

    commit("SET_MENU_LIST", response.data.listMenu);
  },
  async fetchOne({ commit }, id) {
    const response = await graphqlClient.query({
      query: GET_MENU,
      variables: {
        id: id
      }
    });

    commit("SET_MENU", response.data.getMenu);
  },
  async create({ commit }, variables) {
    return await graphqlClient.mutate({
      mutation: CREATE_MENU,
      variables: variables
    });
  },
  async update({ commit }, variables) {
    return await graphqlClient.mutate({
      mutation: UPDATE_MENU,
      variables: variables
    });
  },
  async deleteOne({ commit }, id) {
    return await graphqlClient.mutate({
      mutation: DELETE_MENU,
      variables: {
        id: id
      }
    });
  }
};

const getters: any = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
