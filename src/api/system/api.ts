import type {
  ApiDataModel,
  CommonIdData,
  CommonIdsData,
  CommonPageData,
  CommonTableResult,
} from "@/types";

export const getApiList = (params: CommonPageData) => {
  return usePost<CommonTableResult, CommonPageData>("/api/getApiList", params);
};

export const createApi = (params: ApiDataModel) => {
  return usePost<ApiDataModel, ApiDataModel>("/api/createApi", params);
};

export const updateApi = (params: ApiDataModel) => {
  return usePut<ApiDataModel, ApiDataModel>("/api/updateApi", params);
};

export const deleteApi = (params: CommonIdData) => {
  return useDelete<any, CommonIdData>("/api/deleteApi", params);
};

export const deleteApiByIds = (params: CommonIdsData) => {
  return useDelete<any, CommonIdsData>("/api/deleteApiByIds", params);
};

export const getApiById = (params: CommonIdData) => {
  return usePost<any, CommonIdData>("/api/getApiById", params);
};

export const getAllApis = () => {
  return usePost<any, undefined>("/api/getAllApis");
};
