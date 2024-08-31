export const formDataConfig = {
  name: "到POP设备",
  // formLabelCol: { span: 0 },
  formItemLabelCol: { span: 4 },
  // formItemColSpan: 8,
  formItems: [
    {
      name: "popDevIds",
      type: "formSlot_1",
      label: "POP设备",
      // colXlSpan: 24,
      // colXxlSpan: 24,
      // labelXlCol: { span: 4 },
      // labelXxlCol: { span: 4 },
    },
  ],
  rules: {
    popDevIds: [
      { required: true, message: "POP设备不能为空", trigger: "blur" },
    ],
  },
};
