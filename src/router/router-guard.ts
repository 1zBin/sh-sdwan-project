// 路由守卫配置
import router from "@/router";
import { useToken, useUserStore } from "@/stores";
import nprogress from "nprogress";
import "nprogress/nprogress.css"; // 引入进度条样式
import { notification } from "ant-design-vue";

router.beforeEach(async (to, _from, next) => {
  nprogress.start();
  const { token } = useToken();

  if (token) {
    // 有token的情况下
    if (to.path === "/Login") {
      next("/");
    } else {
      // 获取
      const userStore = useUserStore();
      if (!userStore.routerData) {
        let currentRoute = await userStore.generateDynamicRoutes();
        if (currentRoute.children && currentRoute.children.length) {
          if (
            currentRoute.children.findIndex(
              (item: any) => item.path == "/person"
            ) === -1
          ) {
            currentRoute.children = [
              ...currentRoute.children,
              {
                id: 7,
                parentId: "0",
                path: "/person",
                name: "Person",
                hidden: false,
                sort: 4,
                meta: {
                  keepAlive: false,
                  defaultMenu: false,
                  title: "个人信息",
                  icon: "message",
                  closeTab: false,
                },
                menuId: "7",
                component: () => import(`/src/pages/person/index.vue`),
              },
            ];
          }
        }
        router.addRoute(currentRoute);
        next({
          ...to,
          replace: true,
        });
        return;
      }
    }
    next(); //放行
  } else {
    // 未登录状态的白名单
    const whiteList = ["/Login", "/404"];
    if (whiteList.includes(to.path)) {
      next();
    } else {
      next("/Login");
    }
  }
});

router.afterEach((to, from) => {
  // TODO
  const title = to.meta?.title;
  if (title) document.title = title as string;
  nprogress.done();
  // 从登录页跳转到首页时右上角提示登录成功
  if (from.fullPath === "/Login" && to.fullPath === "/dashboard/analysis") {
    notification.info({
      message: "登录成功",
      description: "欢迎回来！",
      placement: "topRight",
      duration: 2,
    });
  }
});
