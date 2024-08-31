export interface DataType {
  backupID?: number;
  devId?: number;
  devType?: string;
}

// 重启设备
export const reboot = (params: DataType) => {
  return usePost<any, DataType>("/v1/dev/reboot", params);
};

// 重置设备
export const reset = (params: DataType) => {
  return usePost<any, DataType>("/v1/dev/reset", params);
};

// 设备关机
export const shutdown = (params: DataType) => {
  return usePost<any, DataType>("/v1/dev/shutdown", params);
};
