import type { CommonIdData, CommonPageData } from "@/types";
import request from "@/utils/request";

export const uploadFile = (params: any) => {
  return usePost<any, any>("/headPhoto/uploadFile", params);
};

export const getFileList = (params: CommonPageData) => {
  return usePost<any, CommonPageData>("/headPhoto/getFileList", params);
};

export const deleteFile = (params: CommonIdData) => {
  return usePost<any, CommonIdData>("/headPhoto/deleteFile", params);
};

// 渲染图片
export function showFile(url: string) {
  return request({
    url: url,
    method: "GET",
    responseType: "blob",
  });
}

// 下载文件
export function downFile(url: string) {
  return request({
    url: url,
    method: "GET",
    responseType: "arraybuffer",
  });
}
