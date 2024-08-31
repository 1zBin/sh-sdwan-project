export const formDataConfig = {
  name: "Api",
  formItems: [
    {
      name: "apiGroup",
      type: "input",
      label: "Api组",
      placeholder: "请选择Api组",
    },
    {
      name: "path",
      type: "input",
      label: "Api路径",
      placeholder: "请输入Api路径",
    },
    {
      name: "method",
      type: "select",
      label: "方法类型",
      placeholder: "请选择方法类型",
      options: [
        {
          value: "POST",
          label: "创建-POST",
        },
        {
          value: "GET",
          label: "查看-GET",
        },
        {
          value: "PUT",
          label: "更新-PUT",
        },
        {
          value: "DELETE",
          label: "删除-DELETE",
        },
      ],
    },
    {
      name: "description",
      type: "input",
      label: "中文描述",
      placeholder: "请输入描述",
    },
  ],
  rules: {
    apiGroup: [{ required: true, message: "Api组不能为空", trigger: "blur" }],
    path: [{ required: true, message: "路由path不能为空", trigger: "blur" }],
    method: [{ required: true, message: "方法类型不能为空", trigger: "blur" }],
    description: [
      { required: true, message: "中文描述不能为空", trigger: "blur" },
    ],
  },
};
