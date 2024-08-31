export const topToolsConfig = {
  // --------------页面标识---------------
  name: "user",
  // --------------topTools参数--------------
  search: [
    {
      key: 1,
      name: "用户名",
      keyword: "userName",
      type: "text",
    },
    {
      key: 2,
      name: "昵称",
      keyword: "nickName",
      type: "text",
    },
    {
      key: 3,
      name: "手机号码",
      keyword: "phone",
      type: "text",
    },
    {
      key: 4,
      name: "电子邮箱",
      keyword: "email",
      type: "text",
    },
    {
      key: 5,
      name: "状态",
      keyword: "enable",
      type: "select",
      options: [
        {
          label: "启用",
          value: 1,
        },
        {
          label: "冻结",
          value: 2,
        },
      ],
    },
  ],
};
