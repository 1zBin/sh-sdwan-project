export const formDataConfig = {
  name: "用户",
  formItemColSpan: 24,
  formItemLabelCol: { span: 4 },
  formItems: [
    {
      name: "nickName",
      type: "input",
      label: "昵称",
      placeholder: "请输入昵称",
    },
    {
      name: "phone",
      type: "input",
      label: "手机号",
      placeholder: "请输入手机号码",
    },
    {
      name: "email",
      type: "input",
      label: "电子邮箱",
      placeholder: "请输入电子邮箱",
    },
    {
      name: "authorityIds",
      type: "formSlot_1",
      label: "用户角色",
    },
    {
      name: "enable",
      type: "switch",
      label: "用户状态",
      checkedValue: 1,
      unCheckedValue: 2,
    },
    {
      name: "headerImg",
      type: "formSlot_2",
      label: "用户头像",
      isSlot: true,
    },
  ],
  rules: {
    // userName: [
    //   { required: true, message: "用户姓名不能为空", trigger: "blur" },
    //   {
    //     min: 3,
    //     max: 12,
    //     message: "用户姓名为3-12位",
    //   },
    // ],
    // nickName: [
    //   { required: true, message: "昵称不能为空", trigger: "blur" },
    //   {
    //     min: 3,
    //     max: 12,
    //     message: "昵称为3-12位",
    //   },
    // ],
    phone: [
      { required: true, message: "手机号不能为空", trigger: "blur" },
      {
        pattern: /^1[3-9]\d{9}$/,
        message: "手机号格式不正确",
        trigger: "blur",
      },
    ],

    email: [
      { required: true, message: "请输入你的邮箱", trigger: "blur" },
      {
        type: "email",
        pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
        min: 9,
        max: 18,
        message: "邮箱格式错误",
        trigger: "blur",
      },
    ],
    authorityIds: [
      { required: true, message: "角色不能为空", trigger: "blur" },
    ],
  },
};
