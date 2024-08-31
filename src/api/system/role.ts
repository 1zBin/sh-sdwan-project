import type {
  CommonPageData,
  CommonTableResult,
  RoleDataModel,
  CopyRoleData,
} from "@/types";

export const getRoleList = (params: CommonPageData) => {
  return usePost<CommonTableResult, CommonPageData>(
    "/role/getRoleList",
    params
  );
};

export const createRole = (params: RoleDataModel) => {
  return usePost<RoleDataModel, RoleDataModel>("/role/createRole", params);
};

export const updateRole = (params: RoleDataModel) => {
  return usePut<RoleDataModel, RoleDataModel>("/role/updateRole", params);
};

export const deleteRole = (params: { authorityId: number }) => {
  return useDelete<any, { authorityId: number }>("/role/deleteRole", params);
};

export const copyRole = (params: CopyRoleData) => {
  return usePost<any, CopyRoleData>("/role/copyRole", params);
};

export const setRoleAssociation = (params: RoleDataModel) => {
  return usePost<RoleDataModel, RoleDataModel>(
    "/role/setRoleAssociation",
    params
  );
};
