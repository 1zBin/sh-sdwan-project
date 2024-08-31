import type { CommonIdData, CommonPageData, CommonTableResult } from "@/types";

export interface CpeDevData {
  id?: number | undefined;
  comment?: string;
  ip?: string;
  manageAccount?: string;
  managePassword?: string;
  name?: string;
}

export interface AddPopDevData {
  cpeDevId?: number;
  popDevIds?: number[];
}

interface AddIpDhcpClient {
  configBelong?: string;
  cpeDevID?: number;
  defaultRouteDistance?: string;
  devPort: string;
  disabled: string;
  popDevID?: number;
  skipControlerAndDevConsistencyCheck?: string;
}

interface AddLanDhcpExcludedIp {
  end: string;
  start: string;
}

interface IpPool {
  addLanDhcpExcludedIp: AddLanDhcpExcludedIp[];
  comment: string;
  cpeDevID: number;
  popDevID: number;
  skipControlerAndDevConsistencyCheck: string;
}

interface AddIpCommon {
  addDefaultRoute: string;
  name: string;
  password: string;
  user: string;
  defaultRouteDistance?: string;
  address?: string;
  devPort?: string;
  ipPool?: IpPool;
  leaseTime?: string;
  comment?: string;
  configBelong?: string;
  cpeDevID?: number;
  disabled?: string;
  distance?: string;
  dstAddress?: string;
  gateway?: string;
  popDevID?: number;
  skipControlerAndDevConsistencyCheck?: string;
}

interface LanStatic {
  addIpDhcpServer?: AddIpCommon | {};
  addIpAddress?: AddIpCommon | {};
  addIpRoute?: AddIpCommon | {};
}

export interface ConLanData {
  addIpDhcpClient?: AddIpDhcpClient | any;
  confType?: string | undefined;
  cpeDevId?: number;
  lanStatic?: LanStatic | any;
}
export interface ConWanData {
  addInterfacePppoeClient?: AddIpCommon;
  addIpAddress?: AddIpCommon;
  addIpDhcpClient?: AddIpCommon;
  addIpRoute?: AddIpCommon;
  confType?: string;
  cpeDevId?: number;
}

// 添加Cpe设备
export const addCpeDev = (params: CpeDevData) => {
  return usePost<any, CpeDevData>("/v1/cpeDev/addCpeDev", params);
};
// 添加Pop设备
export const addToPopDev = (params: AddPopDevData) => {
  return usePost<any, AddPopDevData>("/v1/cpeDev/addToPopDev", params);
};
// LAN口配置
export const confLan = (params: ConLanData) => {
  return usePost<any, ConLanData>("/v1/cpeDev/confLan", params);
};
// WAN口配置
export const confWan = (params: ConWanData) => {
  return usePost<any, ConWanData>("/v1/cpeDev/confWan", params);
};

// 删除Cpe设备
export const deleteCpeDev = (params: CommonIdData) => {
  return useDelete<any, CommonIdData>("/v1/cpeDev/deleteCpeDev", params);
};

// 用id查询Cpe设备
export const getCpeDev = (params: CommonIdData) => {
  return useGet<any, CommonIdData>("/v1/cpeDev/getCpeDev", params);
};

// 分页获取Cpe设备列表
export const getCpeDevList = (params: CommonPageData) => {
  return useGet<CommonTableResult, CommonPageData>(
    "/v1/cpeDev/getCpeDevList",
    params
  );
};

// 更新Cpe设备
export const updateCpeDev = (params: CpeDevData) => {
  return usePut<any, CpeDevData>("/v1/cpeDev/updateCpeDev", params);
};

// 查询CPE添加到哪些POP设备
export const getCpeAtPop = (params: CommonIdData) => {
  return useGet<any, CommonIdData>("/v1/cpeDev/getCpeAtPop", params);
};

// 查询IpDhcpServer Lan配置
export const getIpDhcpServerList = (params: any) => {
  return useGet<any, any>("/v1/cpeDev/getIpDhcpServerList", params);
};

// 查询InterfacePppoeClient Lan/Wan配置
export const getInterfacePppoeClientList = (params: any) => {
  return useGet<any, any>("/v1/cpeDev/getInterfacePppoeClientList", params);
};
// 查询IpAddress Lan/Wan配置
export const getIpAddressList = (params: any) => {
  return useGet<any, any>("/v1/cpeDev/getIpAddressList", params);
};
// 查询IpDhcpClient Lan/Wan配置
export const getIpDhcpClientList = (params: any) => {
  return useGet<any, any>("/v1/cpeDev/getIpDhcpClientList", params);
};
// 查询IpRoute Lan/Wan配置
export const getIpRouteList = (params: any) => {
  return useGet<any, any>("/v1/cpeDev/getIpRouteList", params);
};

// --------------------- DNS ----------------------

// 添加DNS
export const addIpDns = (params: any) => {
  return usePost<any, any>("/v1/ipDns/addIpDns", params);
};

// 查询DNS
export const getIpDnsList = (params: any) => {
  return useGet<any, any>("/v1/ipDns/getIpDnsList", params);
};

// 移除DNS
export const removeIpDns = (params: any) => {
  return useDelete<any, any>("/v1/ipDns/removeIpDns", params);
};

// 修改DNS
export const setIpDns = (params: any) => {
  return usePut<any, any>("/v1/ipDns/setIpDns", params);
};
