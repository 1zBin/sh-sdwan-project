export const formDataConfig = {
  name: "POP角色",
  formItemColSpan: 24,
  formItemLabelCol: { span: 4 },
  formItems: [
    {
      name: "kind",
      type: "select",
      label: "POP类型",
      placeholder: "请选择POP类型",
      options: [
        {
          value: "网关POP",
          label: "网关POP",
        },
        {
          value: "管理POP",
          label: "管理POP",
        },
        {
          value: "DHCP Server",
          label: "DHCP Server",
        },
        {
          value: "RR路由反射器",
          label: "RR路由反射器",
        },
      ],
    },
  ],
  rules: {
    kind: [{ required: true, message: "POP类型不能为空", trigger: "blur" }],
  },
};
