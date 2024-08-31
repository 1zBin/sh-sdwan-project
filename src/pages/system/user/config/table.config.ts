import { checkPermission } from "~@/utils/checkPermission";

export const tableDataConfig = {
  // --------------页面标识---------------
  name: "user",

  // --------------bodyCell参数--------------
  enablePermission: "system-user-enable",
  action: [
    {
      name: "重置密码",
      key: "reset",
      permission: "system-user-reset",
      style: { color: "#67c23a" },
    },
    {
      name: "编辑",
      key: "edit",
      permission: "system-user-edit",
      style: {},
    },
    {
      name: "删除",
      key: "del",
      permission: "system-user-del",
      style: { color: "rgb(245 108 108)" },
    },
  ],

  // --------------模态框弹窗参数--------------
  modalArguments: {
    delete: {
      title: "请问是否要删除该记录？",
    },
    switch: {
      title: "请问是否用户状态？",
    },
    reset: {
      title: "请问是否要重置该用户密码？",
    },
  },
};

export const tableOption = {
  id: "user",
  border: "inner", // 是否带有边框(default, full, outer, inner, none)
  loading: false, // 表格是否显示加载中
  printConfig: {}, // 打印配置项
  importConfig: {}, // 导入配置项
  exportConfig: {}, // 导出配置项
  // 个性化信息配置项
  customConfig: {
    storage: true, // 是否启用 localStorage 本地保存
  },
  columnConfig: {
    resizable: true, // 每一列是否启用列宽调整
  },
  // 工具栏配置
  toolbarConfig: {
    // 顶部按钮配置
    buttons: [
      {
        code: "add",
        name: "新增",
        status: "primary",
        visible: checkPermission("system-user-add"),
      },
      // {
      //   code: "system-menu-dels",
      //   name: "批量删除",
      //   status: "danger",
      //   visible: checkPermission("system-menu-dels"),
      // },
    ],
    import: false, // 开启导入功能
    export: true, // 开启导出功能
    print: true, // 开启打印功能
    zoom: true, // 开启全屏功能
    custom: true, // 开启个性化配置
  },
  // 列配置
  columns: [
    {
      field: "userName",
      title: "用户名",
    },
    {
      field: "nickName",
      title: "用户昵称",
    },
    {
      field: "phone",
      title: "手机号码",
    },
    {
      field: "email",
      title: "电子邮箱",
    },
    {
      field: "enable",
      title: "状态",
      checkedValue: 1,
      unCheckedValue: 2,
    },
    {
      field: "action",
      title: "操作",
      slots: { default: "name" },
      fixed: "right", // 固定列在右侧
      width: 200,
    },
  ],
};
