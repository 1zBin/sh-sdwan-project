export const formDataConfig = {
  name: "角色",
  formItems: [
    {
      name: "parentName",
      type: "input",
      label: "父级角色",
      disabled: true,
    },
    {
      name: "authorityName",
      type: "input",
      label: "角色名称",
      placeholder: "请输入角色名称",
    },
    {
      name: "authorityId",
      type: "inputNumber",
      label: "角色编码",
      placeholder: "请输入角色编码",
      style: { width: "100%" },
      min: 1,
      max: 999999,
      controls: false,
      disabled: true,
    },
  ],
  rules: {
    authorityName: [
      {
        min: 3,
        max: 12,
        message: "角色名称为3-12位",
        trigger: "blur",
      },
      { required: true, message: "角色名称不能为空", trigger: "blur" },
    ],
    // authorityId: [
    //   { required: true, message: "角色ID不能为空", trigger: "blur" },
    // ],
  },
};
