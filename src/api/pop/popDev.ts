import type {
  CommonIdData,
  CommonIdsData,
  CommonPageData,
  CommonTableResult,
} from "@/types";

export interface AdminAddressPoolData {
  comment?: string;
  pool?: string;
  popDevID?: number;
  id?: number;
}

export interface PopDevData {
  id?: number;
  address?: string;
  apiPort?: number;
  comment?: string;
  identifier?: string;
  manageAccount?: string;
  manageIP?: string;
  managePassword?: string;
  name?: string;
  popKindIds?: number[];
  sshPort?: number;
  useTls?: string;
  warranty?: string;
}

export interface PopWanData {
  id?: number;
  domainName?: string;
  ip: string;
  kind: string;
  popDevID?: number;
  port?: string;
  priority?: number;
}

// ---------------------- 管理IP地址池 ----------------------

// 添加管理IP地址池
export const addAdminAddressPool = (params: AdminAddressPoolData) => {
  return usePost<any, AdminAddressPoolData>(
    "/v1/adminAddressPool/addAdminAddressPool",
    params
  );
};

// 删除管理IP地址池
export const deleteAdminAddressPool = (params: CommonIdData) => {
  return useDelete<any, CommonIdData>(
    "/v1/adminAddressPool/deleteAdminAddressPool",
    params
  );
};

// 批量删除管理IP地址池
export const deleteAdminAddressPoolByIds = (params: CommonIdsData) => {
  return useDelete<any, CommonIdsData>(
    "/v1/adminAddressPool/deleteAdminAddressPoolByIds",
    params
  );
};

// 用id查询管理IP地址池
export const getAdminAddressPool = (params: CommonIdData) => {
  return useGet<any, CommonIdData>(
    "/v1/adminAddressPool/getAdminAddressPool",
    params
  );
};

// 分页获取管理IP地址池列表
export const getAdminAddressPoolList = (params: CommonPageData) => {
  return useGet<CommonTableResult, CommonPageData>(
    "/v1/adminAddressPool/getAdminAddressPoolList",
    params
  );
};

// 更新管理IP地址池
export const updateAdminAddressPool = (params: AdminAddressPoolData) => {
  return usePut<any, AdminAddressPoolData>(
    "/v1/adminAddressPool/updateAdminAddressPool",
    params
  );
};

// ---------------------- 互联IP地址池 ----------------------

// 添加互联IP地址池
export const addConnAddressPool = (params: AdminAddressPoolData) => {
  return usePost<any, AdminAddressPoolData>(
    "/v1/connAddressPool/addConnAddressPool",
    params
  );
};

// 删除互联IP地址池
export const deleteConnAddressPool = (params: CommonIdData) => {
  return useDelete<any, CommonIdData>(
    "/v1/connAddressPool/deleteConnAddressPool",
    params
  );
};

// 批量删除互联IP地址池
export const deleteConnAddressPoolByIds = (params: CommonIdsData) => {
  return useDelete<any, CommonIdsData>(
    "/v1/connAddressPool/deleteConnAddressPoolByIds",
    params
  );
};

// 用id查询互联IP地址池
export const getConnAddressPool = (params: CommonIdData) => {
  return useGet<any, CommonIdData>(
    "/v1/connAddressPool/getConnAddressPool",
    params
  );
};

// 分页获取互联IP地址池列表
export const getConnAddressPoolList = (params: CommonPageData) => {
  return useGet<CommonTableResult, CommonPageData>(
    "/v1/connAddressPool/getConnAddressPoolList",
    params
  );
};

// 更新互联IP地址池
export const updateConnAddressPool = (params: AdminAddressPoolData) => {
  return usePut<any, AdminAddressPoolData>(
    "/v1/connAddressPool/updateConnAddressPool",
    params
  );
};

// ---------------------- POP设备 ----------------------

// 添加POP设备
export const createPopDev = (params: PopDevData) => {
  return usePost<any, PopDevData>("/v1/popDev/createPopDev", params);
};

// 删除POP设备
export const deletePopDev = (params: CommonIdData) => {
  return useDelete<any, CommonIdData>("/v1/popDev/deletePopDev", params);
};

// 批量删除POP设备
export const deletePopDevByIds = (params: CommonIdsData) => {
  return useDelete<any, CommonIdsData>("/v1/popDev/deletePopDevByIds", params);
};

// 用id查询POP设备
export const getPopDev = (params: CommonIdData) => {
  return useGet<any, CommonIdData>("/v1/popDev/getPopDev", params);
};

// 分页获取POP设备列表
export const getPopDevList = (params: CommonPageData) => {
  return useGet<CommonTableResult, CommonPageData>(
    "/v1/popDev/getPopDevList",
    params
  );
};

// 更新POP设备
export const updatePopDev = (params: PopDevData) => {
  return usePut<any, PopDevData>("/v1/popDev/updatePopDev", params);
};

// ---------------------- WAN口 ----------------------

// 配置WAN口
export const addPopWan = (params: PopWanData) => {
  return usePost<any, PopWanData>("/v1/popWan/addPopWan", params);
};

// 删除WAN口配置
export const deletePopWan = (params: CommonIdData) => {
  return useDelete<any, CommonIdData>("/v1/popWan/deletePopWan", params);
};

// 用id查询WAN口配置
export const getPopWan = (params: CommonIdData) => {
  return useGet<any, CommonIdData>("/v1/popWan/getPopWan", params);
};

// 分页获取WAN口配置列表
export const getPopWanList = (params: any) => {
  return useGet<any, any>("/v1/popWan/getPopWanList", params);
};

// 更新WAN口配置
export const updatePopWan = (params: PopWanData) => {
  return usePut<any, PopWanData>("/v1/popWan/updatePopWan", params);
};
