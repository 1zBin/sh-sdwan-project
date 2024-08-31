// CPE/POP添加路由
export const addIpRoute = (params: any) => {
  return usePost<any, any>("/v1/ipRoute/addIpRoute", params);
};

// 查询LAN/WAN业务及路由
export const getIpRouteList = (params: any) => {
  return useGet<any, any>("/v1/ipRoute/getIpRouteList", params);
};

// 移除路由
export const removeIpRoute = (params: any) => {
  return useDelete<any, any>("/v1/ipRoute/removeIpRoute", params);
};

// 修改路由
export const setIpRoute = (params: any) => {
  return usePut<any, any>("/v1/ipRoute/setIpRoute", params);
};
