import type { CommonPageData } from "@/types";

// 初始化网络
export const getUninitializedCpeDevList = (params: CommonPageData) => {
  return useGet<any, CommonPageData>(
    "/v1/uninitializedCpeDev/getUninitializedCpeDevList",
    params
  );
};
