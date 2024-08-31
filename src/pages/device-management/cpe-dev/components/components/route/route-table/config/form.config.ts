export const formDataConfig = {
  name: "设备路由",
  // formItemColSpan: 24,
  // formItemLabelCol: { span: 4 },
  formItems: [
    {
      name: "gateway",
      type: "input",
      label: "网关",
      placeholder: "请输入网关",
    },
    {
      name: "dstAddress",
      type: "input",
      label: "目标地址",
      placeholder: "请输入目标地址",
    },
    {
      name: "distance",
      type: "input",
      label: "管理距离",
      placeholder: "请输入管理距离",
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
    gateway: [{ required: true, message: "网关不能为空", trigger: "blur" }],
    dstAddress: [
      { required: true, message: "目标距离不能为空", trigger: "blur" },
    ],
  },
};
