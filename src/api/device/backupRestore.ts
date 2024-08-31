import type { CommonPageData, CommonTableResult } from "@/types";

export interface BackupData {
  id?: number;
  backupType?: string;
  comment?: string;
  cpeDevID?: number;
  popDevID?: number;
  backupID?: number;
}

// 设备备份
export const backup = (params: BackupData) => {
  return usePost<any, BackupData>("/v1/backupRestore/backup", params);
};

// 分页获取设备备份列表
export const getBackupList = (params: CommonPageData) => {
  return useGet<CommonTableResult, CommonPageData>(
    "/v1/backupRestore/getBackupList",
    params
  );
};

// 设备恢复
export const restore = (params: BackupData) => {
  return usePost<any, BackupData>("/v1/backupRestore/restore", params);
};
