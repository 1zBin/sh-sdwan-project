import type {
  CommonIdData,
  CommonIdsData,
  CommonPageData,
  CommonTableResult,
} from "@/types";

export interface InitDhcpData {
  id?: number;
  apiPort?: number;
  brand?: string;
  comment?: string;
  identifier?: string;
  manageAccount?: string;
  manageIP?: string;
  managePassword?: string;
  modelNumber?: string;
  name?: string;
  osVersion?: string;
  sn?: string;
  sshPort?: number;
  useTls?: string;
  warranty?: string;
}

// 添加initDhcp
export const createInitDhcp = (params: InitDhcpData) => {
  return usePost<any, InitDhcpData>("/v1/initDhcp/createInitDhcp", params);
};

// 删除initDhcp
export const deleteInitDhcp = (params: CommonIdData) => {
  return useDelete<any, CommonIdData>("/v1/initDhcp/deleteInitDhcp", params);
};

// 批量删除initDhcp
export const deleteInitDhcpByIds = (params: CommonIdsData) => {
  return useDelete<any, CommonIdsData>(
    "/v1/initDhcp/deleteInitDhcpByIds",
    params
  );
};

// 用id查询initDhcp
export const getInitDhcp = (params: CommonIdData) => {
  return useGet<any, CommonIdData>("/v1/initDhcp/getInitDhcp", params);
};

// 分页获取initDhcp列表
export const getInitDhcpList = (params: CommonPageData) => {
  return useGet<CommonTableResult, CommonPageData>(
    "/v1/initDhcp/getInitDhcpList",
    params
  );
};

// 更新initDhcp
export const updateInitDhcp = (params: InitDhcpData) => {
  return usePut<any, InitDhcpData>("/v1/initDhcp/updateInitDhcp", params);
};
