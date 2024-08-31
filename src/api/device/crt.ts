// 下载证书
export const dwonloadCrt = (params: { crtType: number }) => {
  return useGet<any, { crtType: number }>("/v1/crt/dwonloadCrt", params, {
    responseType: "arraybuffer",
  });
};
