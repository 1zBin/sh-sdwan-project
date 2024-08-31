import type { CommonIdData, CommonPageData, CommonTableResult } from "@/types";

export interface RegisterFromParams {
  authorityId?: number;
  authorityIds?: number[];
  email?: string;
  enable?: number;
  phone?: string;
}
export interface ModifyUserInfoParams {
  authorityId?: number;
  authorityIds?: number[];
  email?: string;
  enable?: number;
  headerImg?: string;
  id?: number;
  nickName?: string;
  phone?: string;
  sideMode?: string;
  activeColor?: string;
}

export interface ChangePasswordModel {
  confirmNewPassword: string;
  newPassword: string;
  password: string;
}

// 分页获取用户列表
export const getUserList = (params: CommonPageData) => {
  return usePost<CommonTableResult, CommonPageData>(
    "/user/getUserList",
    params
  );
};

// 重置用户密码
export const resetPassword = (params: CommonIdData) => {
  return usePost<any, CommonIdData>("/user/resetPassword", params);
};

// 管理员注册用户账号
export const registerFromAdmin = (params: RegisterFromParams) => {
  return usePost<any, RegisterFromParams>("/user/registerFromAdmin", params);
};

// 管理员设置用户信息
export const modifyUserInfoFromAdmin = (params: ModifyUserInfoParams) => {
  return usePut<any, ModifyUserInfoParams>(
    "/user/modifyUserInfoFromAdmin",
    params
  );
};

// 用户修改自身信息
export const modifyUserInfoSelf = (params: ModifyUserInfoParams) => {
  return usePut<any, ModifyUserInfoParams>("/user/modifyUserInfoSelf", params);
};

// 用户修改密码
export const changePassword = (params: ChangePasswordModel) => {
  return usePost<any, ChangePasswordModel>("/user/changePassword", params);
};

// 删除用户
export const deleteUser = (params: CommonIdData) => {
  return useDelete<any, CommonIdData>("/user/deleteUser", params);
};

// 用户切换到其他角色
export const changeUserRole = (params: ModifyUserInfoParams) => {
  return usePost<any, ModifyUserInfoParams>("/user/changeUserRole", params);
};

// 修改用户页面布局
export const updatUserPageLayout = (params: any) => {
  return usePut<any, any>("/user/updatUserPageLayout", params);
};
