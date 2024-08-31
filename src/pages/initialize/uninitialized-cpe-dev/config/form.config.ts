export const formDataConfig = {
  name: "CPE设备",
  formItems: [
    {
      name: "name",
      type: "input",
      label: "名称",
      placeholder: "请输入名称",
    },
    {
      name: "manageAccount",
      type: "input",
      label: "管理帐号",
      placeholder: "请输入管理帐号",
    },
    {
      name: "managePassword",
      type: "input",
      label: "管理密码",
      placeholder: "请输入管理密码",
    },
    {
      name: "comment",
      type: "textarea",
      label: "备注",
      placeholder: "请输入备注",
      rows: 1,
      // colXlSpan: 24,
      // colXxlSpan: 24,
      // labelXlCol: { span: 4 },
      // labelXxlCol: { span: 4 },
    },
  ],
  rules: {
    name: [{ required: true, message: "设备名称不能为空", trigger: "blur" }],
    manageAccount: [
      { required: true, message: "管理账号不能为空", trigger: "blur" },
    ],
    managePassword: [
      { required: true, message: "管理密码不能为空", trigger: "blur" },
    ],
  },
};
