export const formDataConfig = {
  name: "网桥",
  // formItemColSpan: 24,
  // formItemLabelCol: { span: 4 },
  formItems: [
    {
      name: "name",
      type: "input",
      label: "名称",
      placeholder: "请输入名称",
    },
    {
      name: "configBelong",
      type: "select",
      label: "配置类型",
      placeholder: "请选择配置类型",
      options: [
        {
          value: "Wan",
          label: "WAN",
        },
        {
          value: "Lan",
          label: "LAN",
        },
      ],
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
    {
      name: "disabled",
      type: "switch",
      label: "是否禁用",
      checkedValue: "yes",
      unCheckedValue: "no",
    },
    {
      name: "skipControlerAndDevConsistencyCheck",
      type: "switch",
      label: "跳过数据一致性检查",
      checkedValue: "yes",
      unCheckedValue: "no",
    },
  ],
  rules: {
    name: [{ required: true, message: "名称不能为空", trigger: "blur" }],
  },
};
