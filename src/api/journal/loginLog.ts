import type { CommonIdData, CommonPageData, CommonTableResult } from "@/types";

// 分页获取所有用户登录日志
export const getUserLoginLogAllList = (params: CommonPageData) => {
  return useGet<CommonTableResult, CommonPageData>(
    "/userLoginLog/getUserLoginLogAllList",
    params
  );
};

// 用id查询登录日志
export const getUserLoginLogById = (params: CommonIdData) => {
  return useGet<any, CommonIdData>("/userLoginLog/getUserLoginLogById", params);
};

// 分页获取当前用户的登录日志
export const getUserLoginLogSelfList = (params: CommonPageData) => {
  return useGet<CommonTableResult, CommonPageData>(
    "/userLoginLog/getUserLoginLogSelfList",
    params
  );
};
