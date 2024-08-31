import type {
  CommonPageData,
  CommonTableResult,
  CommonIdData,
  CommonIdsData,
} from "@/types";

export const getSysOperationRecordList = (params: CommonPageData) => {
  return useGet<CommonTableResult, CommonPageData>(
    "/sysOperationRecord/getSysOperationRecordList",
    params
  );
};

export const getSysOperationRecord = (params: CommonIdData) => {
  return useGet<any, CommonIdData>(
    "/sysOperationRecord/getSysOperationRecord",
    params
  );
};

export const deleteSysOperationRecord = (params: CommonIdData) => {
  return useDelete<any, CommonIdData>(
    "/sysOperationRecord/deleteSysOperationRecord",
    params
  );
};

export const deleteSysOperationRecordByIds = (params: CommonIdsData) => {
  return useDelete<any, CommonIdsData>(
    "/sysOperationRecord/deleteSysOperationRecordByIds",
    params
  );
};
