import { useMenuStore } from "@/stores";

export const checkPermission = (keys: string, arr?: any[]): boolean => {
  let flag = false;
  const { menuSelf } = useMenuStore();

  if (keys === "defaultTrue") {
    flag = true;
  } else {
    let menus = [];
    if (arr && arr.length) {
      menus = arr;
    } else {
      menus = menuSelf;
    }
    for (let i = 0; i < menus.length; i++) {
      const item = menus[i];
      if (item.btns && typeof item.btns === "object") {
        if (Object.keys(item.btns).includes(keys)) {
          flag = true;
          break;
        }
      }
      if (item.children && item.children.length > 0 && !flag) {
        flag = checkPermission(keys, item.children);
      }
    }
  }
  return flag;
};
