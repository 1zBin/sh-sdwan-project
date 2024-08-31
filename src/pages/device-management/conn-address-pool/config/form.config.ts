export const formDataConfig = {
  name: "管理IP地址池",
  formItemColSpan: 24,
  formItemLabelCol: { span: 4 },
  formItems: [
    {
      name: "pool",
      type: "input",
      label: "IP池",
      placeholder: "请选择IP池",
    },
    {
      name: "popDevID",
      type: "formSlot_1",
      label: "POP设备",
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
    pool: [{ required: true, message: "IP池不能为空", trigger: "blur" }],
    popDevID: [{ required: true, message: "POP设备不能为空", trigger: "blur" }],
  },
};
