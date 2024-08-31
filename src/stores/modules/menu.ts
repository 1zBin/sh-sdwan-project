import { getMenuSelf } from "@/api/system/permission";
import {
  fatherRouterTranfer,
  getMenusView,
  routerTranfer,
} from "@/utils/recursion";
import { defineStore } from "pinia";
import type { MenuData, MenuDataItem } from "~@/layouts/basic-layout/typing";

export const useMenuStore = defineStore("menus", () => {
  const menuSelf = ref<MenuData>([]);
  const getMenus = async () => {
    const res = await getMenuSelf();
    if (res.data.code === 2000) {
      menuSelf.value = res.data.data.menus.map((item: MenuDataItem) => {
        if (item.children && item.children.length) {
          item["component"] = undefined;
          item["redirect"] = item.children[0].path;
          item.children = routerTranfer(item.children);
        } else {
          item = fatherRouterTranfer(item);
        }
        return item;
      });
      menuSelf.value = getMenusView(menuSelf.value);
    }
    return menuSelf.value;
  };
  return {
    menuSelf,
    getMenus,
  };
});
