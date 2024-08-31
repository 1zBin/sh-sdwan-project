import type { CommonIdData, CommonPageData, CommonTableResult } from "@/types";

// 分页获取所有用户封禁日志
export const getUserLoginLimitLogAllList = (params: CommonPageData) => {
  return useGet<CommonTableResult, CommonPageData>(
    "/userLoginLimitLog/getUserLoginLimitLogAllList",
    params
  );
};

// 用id查询封禁日志
export const getUserLoginLimitLogById = (params: CommonIdData) => {
  return useGet<any, CommonIdData>(
    "/userLoginLimitLog/getUserLoginLimitLogById",
    params
  );
};

// 分页获取当前用户的封禁日志
export const getUserLoginLimitLogSelfList = (params: CommonPageData) => {
  return useGet<CommonTableResult, CommonPageData>(
    "/userLoginLimitLog/getUserLoginLimitLogSelfList",
    params
  );
};
