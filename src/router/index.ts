import { createRouter, createWebHistory } from "vue-router";
import staticRoutes from "./static-routes";

const router = createRouter({
  routes: [...staticRoutes],
  history: createWebHistory(import.meta.env.VITE_APP_BASE),
  // 始终滚动到顶部
  scrollBehavior() {
    return {
      top: 0, // 切换路由时,始终返回顶部
      behavior: "smooth", // 更丝滑的滚动行为
    };
  },
});

export default router;
