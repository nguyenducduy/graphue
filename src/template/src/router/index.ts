import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import store from '@/store'
import LoginLayout from '@/layout/Login/index.vue'
import AdminLayout from '@/layout/Admin/index.vue'

const host = window.location.host

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  // admin pages
  {
    path: '/admin',
    redirect: (to) => ({
      path: '/admin/overview',
      // query: { sort: "id.descend" }
    }),
    component: AdminLayout,
    meta: {
      authRequired: true,
    },
    children: [
      {
        path: '/admin/overview',
        meta: {
          title: 'Overview',
        },
        component: () => import(/* webpackChunkName: "admin_overview" */ '../views/Admin/Overview/index.vue'),
      },
      {
        path: '/admin/user',
        meta: {
          title: 'User',
        },
        component: () => import(/* webpackChunkName: "admin_user" */ '../views/Admin/User/index.vue'),
      },
      {
        path: '/admin/permission',
        meta: {
          title: 'Permission',
        },
        component: () => import(/* webpackChunkName: "admin_permission" */ '../views/Admin/Permission/index.vue'),
      },
      {
        path: '/admin/group',
        meta: {
          title: 'Group',
        },
        component: () => import(/* webpackChunkName: "admin_group" */ '../views/Admin/Group/index.vue'),
      },
      {
        path: '/admin/menu',
        meta: {
          title: 'Menu',
        },
        component: () => import(/* webpackChunkName: "admin_menu" */ '../views/Admin/Menu/index.vue'),
      },
    ],
  },

  // site pages
  {
    path: '/',
    redirect: '/admin/overview',
    component: AdminLayout,
  },

  // Non permmission pages
  {
    path: '/admin/login',
    component: LoginLayout,
    children: [
      {
        path: '/admin/login',
        meta: {
          title: 'views.login.SignIn',
        },
        component: () => import(/* webpackChunkName: "admin_login" */ '../views/Admin/Login/index.vue'),
      },
    ],
  },

  // installation path
  {
    path: '/install',
    component: LoginLayout,
    children: [
      {
        path: '/install',
        meta: {
          title: 'Installation',
        },
        component: () => import(/* webpackChunkName: "admin_install" */ '../views/Install/index.vue'),
      },
    ],
  },

  // google auth redirect
  {
    path: '/oauth/:provider',
    meta: {
      title: 'Oauth',
    },
    component: () => import(/* webpackChunkName: "oauth_verified" */ '../views/oauth.vue'),
  },

  // 404
  {
    path: '/404',
    meta: {
      title: '404',
    },
    component: require('@/views/404').default,
  },

  // Redirect to 404
  {
    path: '*',
    redirect: '/404',
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.authRequired)) {
    const loggedToken = Vue.ls.get('Access-Token')
    const loggedUser = Vue.ls.get('Logged-User')
    const allMenus = Vue.ls.get('All-Menu')
    const accessMenus = Vue.ls.get('Access-Menu')
    const accessPermission = Vue.ls.get('Access-Permission')

    if (!loggedToken) {
      return next({
        path: '/admin/login',
        query: { redirect: to.fullPath },
      })
    }

    // set Logged-Auth & Access-Token & Access-Menu
    store.commit('users/SET_AUTH', {
      token: loggedToken,
      user: loggedUser,
      accessMenus: accessMenus,
    })

    // set All-Menu
    store.commit('SET_ALL_MENU', allMenus)

    // update ability casl
    store.commit('SET_ABILITY', accessPermission)

    next()
  } else {
    next()
  }
})

export default router
