import type { RouteRecordRaw } from "vue-router";
export const ROOT_ROUTE_REDIRECT_PATH = "/dashboard";
const Layout = () => import("@/layouts/index.vue");
// const basicRouteMap = {
//   // iframe模式下使用
//   Iframe: () => import("@/pages/common/iframe.vue"),
//   // 一般用于存在子集的页面
//   RouteView: () => import("@/pages/common/route-view.vue"),
// };
export const rootRoute: RouteRecordRaw = {
  path: "/",
  name: "rootPath",
  redirect: ROOT_ROUTE_REDIRECT_PATH,
  component: Layout,
  children: [],
};

export default [
  // ---------------------------- CPE设备配置 -----------------------------
  {
    path: "/device-management/cpe-dev/config-cpe/:name/:id",
    name: "ConfigCpe",
    meta: {
      title: "配置CPE设备",
    },
    component: () =>
      import("@/pages/device-management/cpe-dev/components/config-cpe.vue"),
  },
  // ---------------------------- POP设备配置 -----------------------------
  {
    path: "/device-management/pop-dev/config-pop/:name/:id",
    name: "ConfigPop",
    meta: {
      title: "配置POP设备",
    },
    component: () =>
      import("@/pages/device-management/pop-dev/components/config-pop.vue"),
  },
] as RouteRecordRaw[];
