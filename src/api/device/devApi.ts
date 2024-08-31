export interface InterfaceList {
  devID?: number;
  devType?: string;
}

// 查询设备接口列表
export const getInterfaceList = (params: InterfaceList) => {
  return useGet<any, InterfaceList>("/v1/devApi/getInterfaceList", params);
};
