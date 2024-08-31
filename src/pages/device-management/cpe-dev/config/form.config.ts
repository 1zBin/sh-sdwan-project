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
      name: "address",
      type: "input",
      label: "安装详细地址",
      placeholder: "请输入安装详细地址",
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
      name: "useTls",
      type: "select",
      label: "是否启用TLS",
      placeholder: "请选择是否启用TLS",
      options: [
        {
          value: "1",
          label: "启用",
        },
        {
          value: "2",
          label: "不启用",
        },
      ],
    },
    {
      name: "apiPort",
      type: "inputNumber",
      label: "API端口明文传输",
      placeholder: "请输入API端口(1024~65535)",
      style: { width: "100%" },
      min: 1024,
      max: 65535,
      controls: false,
    },
    {
      name: "apisPort",
      type: "inputNumber",
      label: "API-SSL端口加密传输",
      placeholder: "请输入API-SSL端口加密传输(1024~65535)",
      style: { width: "100%" },
      min: 1024,
      max: 65535,
      controls: false,
    },
    {
      name: "sshPort",
      type: "inputNumber",
      label: "SSH端口",
      placeholder: "请输入SSH端口(1024~65535)",
      style: { width: "100%" },
      min: 1024,
      max: 65535,
      controls: false,
    },
    {
      name: "identifier",
      type: "input",
      label: "资产编号",
      placeholder: "请输入资产编号",
    },
    {
      name: "warranty",
      type: "datePicker",
      label: "保修日期",
      placeholder: "请输入保修日期",
    },
    {
      name: "comment",
      type: "textarea",
      label: "备注",
      placeholder: "请输入备注",
      rows: 1,
      colXlSpan: 24,
      colXxlSpan: 24,
      labelXlCol: { span: 4 },
      labelXxlCol: { span: 4 },
    },
  ],
  rules: {
    name: [{ required: true, message: "设备名称不能为空", trigger: "blur" }],
    address: [
      { required: true, message: "安装详细地址不能为空", trigger: "blur" },
    ],
    manageAccount: [
      { required: true, message: "管理账号不能为空", trigger: "blur" },
    ],
    managePassword: [
      { required: true, message: "管理密码不能为空", trigger: "blur" },
    ],
  },
};