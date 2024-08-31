export const formDataConfig = {
  name: "DNS",
  // formItemColSpan: 24,
  // formItemLabelCol: { span: 4 },
  formItems: [
    {
      name: "regexp",
      type: "input",
      label: "主机名",
      placeholder: "请输入主机名",
    },
    {
      name: "forwardTo",
      type: "input",
      label: "转发到目标地址",
      placeholder: "请输入转发到目标地址",
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
  ],
  rules: {
    regexp: [{ required: true, message: "主机名不能为空", trigger: "blur" }],
    forwardTo: [
      { required: true, message: "转发到目标地址不能为空", trigger: "blur" },
    ],
  },
};
