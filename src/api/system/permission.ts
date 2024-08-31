import type { MenuDataModel } from "@/types";

interface CasbinInfo {
  method: string;
  path: string;
  pathMethod: string;
}
interface MenuAuthorityModel {
  authorityId?: number;
  menuId?: number;
  menus?: MenuDataModel;
  buttonId?: number;
  buttonIds?: number[];
  casbinInfos?: CasbinInfo[];
}

// ------------------ 角色与菜单 ------------------

// 获取基础菜单树，给角色进行菜单授权
export const getAllBaseMenu = () => {
  return usePost<any, undefined>("/menu/getAllBaseMenu");
};

// 获取指定角色的菜单
export const getMenuAuthority = (params: MenuAuthorityModel) => {
  return usePost<any, MenuAuthorityModel>("/menu/getMenuAuthority", params);
};

// 获取当前用户动态菜单
export const getMenuSelf = () => {
  return usePost<any, undefined>("/menu/getMenuSelf");
};

// 为指定角色增加菜单权限
export const addMenuAuthority = (params: MenuAuthorityModel) => {
  return usePost<any, MenuAuthorityModel>("/menu/addMenuAuthority", params);
};

// ------------------ 角色与Api ------------------

// 获取指定角色的Api权限列表
export const getRoleAuthorityById = (params: MenuAuthorityModel) => {
  return usePost<any, MenuAuthorityModel>(
    "/casbin/getRoleAuthorityById",
    params
  );
};
// 更新指定角色的Api权限
export const updateRoleAuthorityById = (params: MenuAuthorityModel) => {
  return usePost<any, MenuAuthorityModel>(
    "/casbin/updateRoleAuthorityById",
    params
  );
};

// ------------------ 按钮权限 ------------------

// 获取权限按钮
export const getAuthorityBtn = (params: MenuAuthorityModel) => {
  return usePost<any, MenuAuthorityModel>(
    "/authorityBtn/getAuthorityBtn",
    params
  );
};

// 移除权限按钮
export const removeAuthorityBtn = (params: MenuAuthorityModel) => {
  return usePost<any, MenuAuthorityModel>(
    "/authorityBtn/removeAuthorityBtn",
    params
  );
};

// 设置权限按钮
export const setAuthorityBtn = (params: MenuAuthorityModel) => {
  return usePost<any, MenuAuthorityModel>(
    "/authorityBtn/setAuthorityBtn",
    params
  );
};
