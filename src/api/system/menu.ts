import type { CommonPageData, CommonIdData, MenuDataModel } from "@/types";

// 分页获取菜单列表
export const getBaseMenuList = (params: CommonPageData) => {
  return usePost<any, CommonPageData>("/menu/getBaseMenuList", params);
};

// 根据菜单ID获取菜单
export const getBaseMenuById = (params: CommonIdData) => {
  return usePost<any, CommonIdData>("/menu/getBaseMenuById", params);
};

// 创建菜单
export const createBaseMenu = (params: MenuDataModel) => {
  return usePost<any, MenuDataModel>("/menu/createBaseMenu", params);
};

// 更新菜单
export const updateBaseMenu = (params: MenuDataModel) => {
  return usePost<any, MenuDataModel>("/menu/updateBaseMenu", params);
};

// 删除菜单
export const deleteBaseMenu = (params: CommonIdData) => {
  return usePost<any, CommonIdData>("/menu/deleteBaseMenu", params);
};
