// ---------------------- 网桥 ----------------------

// 添加网桥接口
export const addInterfaceBridge = (params: any) => {
  return usePost<any, any>("/v1/interfaceBridge/addInterfaceBridge", params);
};

// 查询设备上所有网桥
export const getInterfaceBridgeList = (params: any) => {
  return useGet<any, any>("/v1/interfaceBridge/getInterfaceBridgeList", params);
};

// 移除网桥接口
export const removeInterfaceBridge = (params: any) => {
  return useDelete<any, any>(
    "/v1/interfaceBridge/removeInterfaceBridge",
    params
  );
};

// 修改网桥接口
export const setInterfaceBridge = (params: any) => {
  return usePut<any, any>("/v1/interfaceBridge/setInterfaceBridge", params);
};

// ---------------------- 网桥接口 ----------------------

// 网桥添加接口
export const addInterfaceBridgePort = (params: any) => {
  return usePost<any, any>(
    "/v1/interfaceBridgePort/addInterfaceBridgePort",
    params
  );
};

// 查询属于该网桥的接口列表
export const getInterfaceBridgePortList = (params: any) => {
  return useGet<any, any>(
    "/v1/interfaceBridgePort/getInterfaceBridgePortList",
    params
  );
};

// 移除网桥上接口
export const removeInterfaceBridgePort = (params: any) => {
  return useDelete<any, any>(
    "/v1/interfaceBridgePort/removeInterfaceBridgePort",
    params
  );
};

// 修改网桥上的接口
export const setInterfaceBridgePort = (params: any) => {
  return usePut<any, any>(
    "/v1/interfaceBridgePort/setInterfaceBridgePort",
    params
  );
};
