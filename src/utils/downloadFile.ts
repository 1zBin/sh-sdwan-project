export const downloadFile = (
  res: any,
  fileName: string, // 文件名
  type?: string, // 文件后缀
  contentType?: string // 指定正确的 MIME 类型
) => {
  const link = document.createElement("a");
  let blob;
  if (contentType) {
    blob = new Blob([res.data], { type: contentType });
  } else {
    blob = new Blob([res.data]);
  }
  link.style.display = "none";
  link.href = URL.createObjectURL(blob);
  if (type) {
    link.setAttribute("download", fileName + "." + type);
  } else {
    link.setAttribute("download", fileName);
  }
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(link.href);
};
