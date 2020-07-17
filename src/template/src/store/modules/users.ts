import Vue from 'vue'
import graphqlClient from '@/helper/apollo'
import {
  COUNT_USER,
  LIST_USER,
  GET_USER,
  CREATE_USER,
  UPDATE_USER,
  DELETE_USER,
  LOGIN_BY_EMAIL,
  CREATE_FROM_GOOGLE_USER,
  LOGOUT_USER,
  LIST_STATUS_USER,
} from '@/graphql/users'

const state: any = {
  auth: null,
  item: null,
  items: [],
  total: 0,
  statusItems: [],
}

const mutations: any = {
  SET_TOTAL(state, count) {
    state.total = count
  },
  SET_USER(state, data) {
    state.item = data
  },
  SET_USER_LIST(state, data) {
    state.items = data.edges
    state.total = data.totalCount
    state.statusItems = data.statusList
  },
  UPDATE_USER(state, data) {
    const index = state.items.findIndex((item) => item.node.id === data.id)
    state.items.splice(index, 1, { node: data })
  },
  SET_AUTH(state, { token, user }) {
    state.auth = {
      user: user,
      token: token,
    }

    Vue.ls.set('Access-Token', token)
    Vue.ls.set('Logged-User', user)
  },
  REMOVE_AUTH(state) {
    Vue.ls.remove('Access-Token')
    Vue.ls.remove('Logged-User')
  },
  SET_STATUS_LIST(state, data) {
    state.statusItems = data
  },
}

const actions: any = {
  async count({ commit }) {
    const response = await graphqlClient.query({
      query: COUNT_USER,
    })

    commit('SET_TOTAL', response.data.listUser.totalCount)
  },
  async fetchAll({ commit }, variables) {
    const response = await graphqlClient.query({
      query: LIST_USER,
      variables: variables,
    })

    commit('SET_USER_LIST', response.data.listUser)
  },
  async fetchOne({ commit }, id) {
    const response = await graphqlClient.query({
      query: GET_USER,
      variables: {
        id: id,
      },
    })

    commit('SET_USER', response.data.getUser)
  },
  async create({ commit }, variables) {
    return await graphqlClient.mutate({
      mutation: CREATE_USER,
      variables: variables,
    })
  },
  async update({ commit }, variables) {
    const response = await graphqlClient.mutate({
      mutation: UPDATE_USER,
      variables: variables,
    })

    commit('UPDATE_USER', response.data.updateUser.user)
  },
  async deleteOne({ commit }, id) {
    await graphqlClient.mutate({
      mutation: DELETE_USER,
      variables: {
        id: id,
      },
    })
  },
  async loginByEmail({ commit }, variables) {
    const response = await graphqlClient.mutate({
      mutation: LOGIN_BY_EMAIL,
      variables: variables,
    })

    commit('SET_AUTH', {
      user: response.data.loginUser.user,
      token: response.data.loginUser.token,
    })

    return response
  },
  async loginByGoogle({ commit }, variables) {
    const response = await graphqlClient.mutate({
      mutation: CREATE_FROM_GOOGLE_USER,
      variables: variables,
    })

    commit('SET_AUTH', {
      user: response.data.createFromGoogleUser.user,
      token: response.data.createFromGoogleUser.token,
    })

    return response
  },
  async logOut({ commit }) {
    await graphqlClient.mutate({
      mutation: LOGOUT_USER,
    })

    commit('REMOVE_AUTH')
  },
  async fetchAllStatus({ commit }) {
    const response = await graphqlClient.query({
      query: LIST_STATUS_USER,
    })

    commit('SET_STATUS_LIST', response.data.listUser.statusList)
  },
}

const getters: any = {
  loggedIn(state) {
    return !!state.auth || false
  },
  loggedUser(state) {
    return state.auth.user || null
  },
  isAuth(state) {
    return Vue.ls.get('Access-Token') || null
  },
  loggedMenu(state) {
    return state.auth.user.menu || null
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
