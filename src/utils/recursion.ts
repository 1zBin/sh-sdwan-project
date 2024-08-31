import type { MenuData, MenuDataItem } from "~@/layouts/basic-layout/typing";

// 数组扁平化，将树形结构数组转为一层结构数组
export const convertToFlat = (treeData: MenuData) => {
  let flatData: MenuDataItem[] = [];
  for (let i = 0; i < treeData.length; i++) {
    if (treeData[i].children) {
      flatData.push(...convertToFlat(treeData[i].children));
      delete treeData[i].children;
    }
    flatData.push({ ...treeData[i] });
  }
  return flatData;
};

// 传入参数：(完整数组，需要对比的子元素ID或parentId)
// 需求：导出找到的父级元素的title
export const deepSearch = (tree: any, id: number) => {
  let flag = false;
  let searchValue = "";
  for (let i = 0; i < tree.length; i++) {
    if (tree[i].children && tree[i].children.length) {
      for (let j = 0; j < tree[i].children.length; j++) {
        if (tree[i].children[j].parentId == id) {
          searchValue = tree[i].meta.title;
          flag = true;
          break;
        } else if (!flag) {
          deepSearch(tree[i].children, id);
          if (deepSearch(tree[i].children, id)) {
            searchValue = deepSearch(tree[i].children, id);
          }
        }
      }
    } else if (flag) {
      break;
    }
  }
  return searchValue;
};

// 传入参数：(完整菜单数组)
// 需求：将数组改造为，只保留所有对象里hidden为false的新数组
export const getMenusView = (menus: MenuData) => {
  let list: any = [];
  menus.forEach((value: any) => {
    if (!value.hidden) {
      list.push(value);
    }
    if (value.children && value.children.length) {
      value.children = getMenusView(value.children);
    }
  });
  return list;
};

// 传入参数：(完整数组)
// 需求：在数组的每个对象里新增title属性，并将meta里面的title赋值给它
export const dataTranfer = (arr: MenuData) => {
  let list: MenuData = [];
  arr.forEach((value: any) => {
    value["value"] = value.meta.title;
    value["title"] = value.meta.title;
    list.push(value);
    if (value.children && value.children.length) {
      value.children = dataTranfer(value.children);
    }
  });
  return list;
};

// 传入参数：(菜单第二层子级数组)
// 需求：在每个子级数组的每个对象里的path和componet改为符合要求的格式
const routeAllPathToCompMap = import.meta.glob(
  `../../src/pages/**/**/index.vue`
);
export const routerTranfer = (menus: MenuData) => {
  let list: MenuData = [];
  menus.forEach((value: MenuDataItem) => {
    // 通过匹配法寻找后端返回路由路径对的上本地的路径，对得上则添加到compontent
    value.component = routeAllPathToCompMap[`../${value.component}`];
    list.push(value);
    if (value.children && value.children.length) {
      value.children = routerTranfer(value.children);
    }
  });
  return list;
};

// 没有子菜单的菜单需要重新赋值component路径
const routeFatherPathToCompMap = import.meta.glob(
  `../../src/pages/**/index.vue`
);
export const fatherRouterTranfer = (item: MenuDataItem) => {
  item.component = routeFatherPathToCompMap[`../${item.component}`];
  return item;
};
