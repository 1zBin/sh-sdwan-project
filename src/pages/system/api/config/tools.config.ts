export const topToolsConfig = {
  // --------------页面标识---------------
  name: "api",
  // --------------topTools参数--------------
  search: [
    {
      key: 1,
      name: "Api组名",
      keyword: "apiGroup",
      type: "text",
    },
    {
      key: 2,
      name: "Api方法",
      keyword: "method",
      type: "select",
      options: [
        {
          label: "创建POST",
          value: "POST",
        },
        {
          label: "查看GET",
          value: "GET",
        },
        {
          label: "更新PUT",
          value: "PUT",
        },
        {
          label: "删除DELETE",
          value: "DELETE",
        },
      ],
    },
    {
      key: 3,
      name: "Api路径",
      keyword: "path",
      type: "text",
    },
  ],
};
