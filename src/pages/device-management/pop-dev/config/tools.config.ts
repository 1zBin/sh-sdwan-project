export const topToolsConfig = {
  // --------------页面标识---------------
  name: "pop-dev",
  // --------------topTools参数--------------
  search: [
    {
      key: 1,
      name: "名称",
      keyword: "name",
      type: "text",
    },
    {
      key: 2,
      name: "品牌",
      keyword: "brand",
      type: "text",
    },
    {
      key: 3,
      name: "型号",
      keyword: "modelNumber",
      type: "text",
    },
    {
      key: 4,
      name: "SN号",
      keyword: "sn",
      type: "text",
    },
    {
      key: 5,
      name: "是否启用TLS",
      keyword: "useTls",
      type: "select",
      options: [
        {
          label: "启用",
          value: "1",
        },
        {
          label: "不启用",
          value: "2",
        },
      ],
    },
  ],
};
