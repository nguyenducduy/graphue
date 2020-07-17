import Vue from "vue";
import graphqlClient from "@/helper/apollo";
import {
  COUNT_GROUP,
  LIST_GROUP,
  GET_GROUP,
  CREATE_GROUP,
  UPDATE_GROUP,
  DELETE_GROUP,
  GRANT_PERMISSION_GROUP
} from "@/graphql/groups";

const state: any = {
  item: null,
  items: [],
  total: 0
};

const mutations: any = {
  SET_TOTAL(state, count) {
    state.total = count;
  },
  SET_GROUP(state, data) {
    state.item = data;
  },
  SET_GROUP_LIST(state, data) {
    state.items = data.edges;
    state.total = data.totalCount;
  },
  UPDATE_GROUP(state, data) {
    const index = state.items.findIndex(item => item.node.id === data.id);
    state.items.splice(index, 1, { node: data });
  }
};

const actions: any = {
  async count({ commit }) {
    const response = await graphqlClient.query({
      query: COUNT_GROUP
    });

    commit("SET_TOTAL", response.data.listGroup.totalCount);
  },
  async fetchAll({ commit }, variables) {
    const response = await graphqlClient.query({
      query: LIST_GROUP,
      variables: variables
    });

    commit("SET_GROUP_LIST", response.data.listGroup);
  },
  async fetchOne({ commit }, id) {
    const response = await graphqlClient.query({
      query: GET_GROUP,
      variables: {
        id: id
      }
    });

    commit("SET_GROUP", response.data.getGroup);
  },
  async create({ commit }, variables) {
    await graphqlClient.mutate({
      mutation: CREATE_GROUP,
      variables: variables
    });
  },
  async update({ commit }, variables) {
    const response = await graphqlClient.mutate({
      mutation: UPDATE_GROUP,
      variables: variables
    });

    commit("UPDATE_GROUP", response.data.updateGroup.group);
  },
  async deleteOne({ commit }, id) {
    await graphqlClient.mutate({
      mutation: DELETE_GROUP,
      variables: {
        id: id
      }
    });
  },
  async grantPermission({ commit }, variables) {
    await graphqlClient.mutate({
      mutation: GRANT_PERMISSION_GROUP,
      variables: variables
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
