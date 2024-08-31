export const topToolsConfig = {
  // --------------页面标识---------------
  name: "operation-record",
  // --------------topTools参数--------------
  search: [
    {
      key: 1,
      name: "方法",
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
      key: 2,
      name: "路径",
      keyword: "path",
      type: "text",
    },
    {
      key: 3,
      name: "状态码",
      keyword: "status",
      type: "text",
    },
    {
      key: 4,
      name: "代理",
      keyword: "agent",
      type: "text",
    },
  ],
};
