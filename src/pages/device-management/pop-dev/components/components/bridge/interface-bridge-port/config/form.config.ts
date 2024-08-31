export const formDataConfig = {
  name: "网桥接口",
  // formItemColSpan: 24,
  // formItemLabelCol: { span: 4 },
  formItems: [
    {
      name: "devPort",
      type: "formSlot_1",
      label: "接口列表",
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
  rules: {},
};
