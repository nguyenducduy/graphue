import Vue from "vue";
import graphqlClient from "@/helper/apollo";
import {
  COUNT_PERMISSION,
  LIST_PERMISSION,
  GET_PERMISSION,
  CREATE_PERMISSION,
  UPDATE_PERMISSION,
  DELETE_PERMISSION
} from "@/graphql/permissions";

const state: any = {
  item: null,
  items: [],
  total: 0
};

const mutations: any = {
  SET_TOTAL(state, count) {
    state.total = count;
  },
  SET_PERMISSION(state, permission) {
    state.item = permission;
  },
  SET_PERMISSION_LIST(state, data) {
    state.items = data.edges;
    state.total = data.totalCount;
  },
  UPDATE_PERMISSION(state, data) {
    const index = state.items.findIndex(item => item.node.id === data.id);
    state.items.splice(index, 1, { node: data });
  }
};

const actions: any = {
  async count({ commit }) {
    const response = await graphqlClient.query({
      query: COUNT_PERMISSION
    });

    commit("SET_TOTAL", response.data.listPermission.totalCount);
  },
  async fetchAll({ commit }, variables) {
    const response = await graphqlClient.query({
      query: LIST_PERMISSION,
      variables: variables
    });

    commit("SET_PERMISSION_LIST", response.data.listPermission);
  },
  async fetchOne({ commit }, id) {
    const response = await graphqlClient.query({
      query: GET_PERMISSION,
      variables: {
        id: id
      }
    });

    commit("SET_PERMISSION", response.data.getPermission);
  },
  async create({ commit }, variables) {
    return await graphqlClient.mutate({
      mutation: CREATE_PERMISSION,
      variables: variables
    });
  },
  async update({ commit }, variables) {
    const response = await graphqlClient.mutate({
      mutation: UPDATE_PERMISSION,
      variables: variables
    });

    commit("UPDATE_PERMISSION", response.data.updatePermission.permission);
  },
  async deleteOne({ commit }, id) {
    await graphqlClient.mutate({
      mutation: DELETE_PERMISSION,
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
