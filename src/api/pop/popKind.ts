import type {
  CommonIdData,
  CommonIdsData,
  CommonPageData,
  CommonTableResult,
} from "@/types";

export interface PopKindData {
  kind?: string;
  id?: number;
}

// 添加POP角色
export const createPopKind = (params: PopKindData) => {
  return usePost<any, PopKindData>("/v1/popKind/createPopKind", params);
};

// 删除POP角色
export const deletePopKind = (params: CommonIdData) => {
  return useDelete<any, CommonIdData>("/v1/popKind/deletePopKind", params);
};

// 批量删除POP角色
export const deletePopKindByIds = (params: CommonIdsData) => {
  return useDelete<any, CommonIdsData>(
    "/v1/popKind/deletePopKindByIds",
    params
  );
};

// 用id查询POP角色
export const getPopKind = (params: CommonIdData) => {
  return useGet<any, CommonIdData>("/v1/popKind/getPopKind", params);
};

// 分页获取POP角色列表
export const getPopKindList = (params: CommonPageData) => {
  return useGet<CommonTableResult, CommonPageData>(
    "/v1/popKind/getPopKindList",
    params
  );
};

// 更新POP角色
export const updatePopKind = (params: PopKindData) => {
  return usePut<any, PopKindData>("/v1/popKind/updatePopKind", params);
};
