export const formDataConfig = {
  name: "菜单",
  formItemColSpan: 24,
  formItemLabelCol: { span: 4 },
  formItems: [
    {
      name: "parentId",
      type: "formSlot_1",
      label: "父级菜单",
    },
    {
      name: "title",
      type: "input",
      label: "菜单名称",
      placeholder: "请输入菜单名称",
    },
    {
      name: "name",
      type: "input",
      label: "路由名称",
      placeholder: "请输入路由名称",
    },
    {
      name: "path",
      type: "input",
      label: "路由路径",
      placeholder: "请输入路由路径",
    },
    {
      name: "component",
      type: "input",
      label: "页面路径",
      placeholder: "**/index",
      addonBefore: "pages/",
      addonAfter: ".vue",
    },
    {
      name: "icon",
      type: "formSlot_3",
      label: "图标",
    },
    {
      name: "hidden",
      type: "radioGroup",
      label: "状态",
    },
    {
      name: "sort",
      type: "inputNumber",
      label: "排序",
      min: 0,
      max: 99,
    },
    {
      name: "menuBtn",
      type: "formSlot_2",
      label: "可控按钮",
    },
  ],
  rules: {
    parentId: [
      { required: true, message: "父级菜单不能为空", trigger: "blur" },
    ],
    title: [{ required: true, message: "菜单名称不能为空", trigger: "blur" }],
    name: [{ required: true, message: "路由name不能为空", trigger: "blur" }],
    path: [{ required: true, message: "路由path不能为空", trigger: "blur" }],
    component: [{ required: true, message: "路径不能为空", trigger: "blur" }],
  },
};
