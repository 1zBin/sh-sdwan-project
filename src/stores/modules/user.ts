import { useMenuStore } from "@/stores";
import type { User } from "@/types";
import type { MenuData } from "~@/layouts/basic-layout/typing";
import dynamicRoutes, { rootRoute } from "~@/router/dynamic-routes";
import { genRoutes } from "~@/router/generate-route";

export const useUserStore = defineStore(
  "user",
  () => {
    const routerData = shallowRef();
    const menuData = shallowRef<MenuData>([]);
    const userInfo = shallowRef<User | undefined>({});

    // 获取个人信息
    const getUserInfo = () => {
      return usePost("/user/getUserInfoSelf");
    };

    const setUserInfo = (value: User | undefined) => {
      userInfo.value = value;
      console.log("userInfo", userInfo.value);
    };
    const removeUserInfo = () => (userInfo.value = {});

    const generateRoutes = async () => {
      const { getMenus } = useMenuStore();
      const menus = await getMenus();

      menuData.value = genRoutes(menus);

      const currentRoute = {
        ...rootRoute,
        children: [...dynamicRoutes, ...menus],
      };

      return currentRoute;
    };

    const generateDynamicRoutes = async () => {
      const routerDatas = await generateRoutes();
      routerData.value = routerDatas;
      return routerDatas;
    };

    return {
      routerData,
      menuData,
      generateDynamicRoutes,
      userInfo,
      setUserInfo,
      removeUserInfo,
      getUserInfo,
    };
  },
  {
    persist: {
      enabled: true,
      strategies: [
        {
          key: "userInfo",
          storage: localStorage,
          paths: ["userInfo"],
        },
      ],
    },
  }
);
