// 静态的路由

import type { RouteRecordRaw } from "vue-router";
const Layout = () => import("@/layouts/index.vue");

export default [
  {
    path: "/Login",
    component: () => import("@/pages/common/login.vue"),
    meta: {
      title: "登录",
    },
  },
  {
    path: "/common",
    name: "LayouBasicRedirect",
    component: Layout,
    redirect: "/redirect",
    children: [
      {
        path: "/redirect/:path(.*)",
        name: "redirect",
        component: () => import("@/pages/common/redirect.vue"),
      },
    ],
  },
  {
    path: "/test",
    component: () => import("@/pages/test/index.vue"),
  },
  {
    path: "/404",
    component: () => import("@/pages/exception/error.vue"),
  },
  {
    path: "/:pathMatch(.*)",
    component: () => import("@/pages/exception/error.vue"),
  },
] as RouteRecordRaw[];
