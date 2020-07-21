import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import store from "@/store";
import LoginLayout from "@/layout/Login/index.vue";
import AdminLayout from "@/layout/Admin/index.vue";

const host = window.location.host;
const parts = host.split(".");

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  // admin pages
  {
    path: "/admin",
    redirect: to => ({
      path: "/admin/overview"
      // query: { sort: "id.descend" }
    }),
    component: AdminLayout,
    meta: {
      authRequired: true
    },
    children: [
      {
        path: "/admin/overview",
        meta: {
          title: `${parts[0]} - Overview`
        },
        component: () => import("../views/Admin/Overview/index.vue")
      },
      {
        path: "/admin/user",
        meta: {
          title: `${parts[0]} - User`
        },
        component: () => import("../views/Admin/User/index.vue")
      },
      {
        path: "/admin/permission",
        meta: {
          title: `${parts[0]} - Permission`
        },
        component: () => import("../views/Admin/Permission/index.vue")
      },
      {
        path: "/admin/group",
        meta: {
          title: `${parts[0]} - Group`
        },
        component: () => import("../views/Admin/Group/index.vue")
      },
      {
        path: "/admin/menu",
        meta: {
          title: `${parts[0]} - Menu`
        },
        component: () => import("../views/Admin/Menu/index.vue")
      }
    ]
  },

  // Non permmission pages
  {
    path: "/admin/login",
    component: LoginLayout,
    children: [
      {
        path: "/admin/login",
        meta: {
          title: `${parts[0]} - Login`
        },
        component: () => import("../views/Admin/Login/index.vue")
      }
      // {
      //   path: '/admin/forgot',
      //   meta: {
      //     title: 'Forgot Password',
      //   },
      //   component: () => import('./views/user/forgot'),
      // },
    ]
  },
  {
    path: "/install",
    component: LoginLayout,
    children: [
      {
        path: "/install",
        meta: {
          title: `${parts[0]} - Installation`
        },
        component: () => import("../views/Install/index.vue")
      }
    ]
  },
  {
    path: "/oauth/:provider",
    meta: {
      title: `${parts[0]} - Oauth`
    },
    component: () => import("../views/oauth.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.authRequired)) {
    const loggedToken = Vue.ls.get("Access-Token");
    const loggedUser = Vue.ls.get("Logged-User");

    if (!loggedToken) {
      return next({
        path: "/admin/login",
        query: { redirect: to.fullPath }
      });
    }

    store.commit("users/SET_AUTH", {
      token: loggedToken,
      user: loggedUser
    });

    store.commit("SET_ABILITY", loggedUser.group.permissions);

    next();
  } else {
    next();
  }
});

export default router;
