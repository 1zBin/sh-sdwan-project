import { checkPermission } from "~@/utils/checkPermission";

export const tableDataConfig = {
  // --------------页面标识---------------
  name: "api",

  // --------------bodyCell参数--------------
  action: [
    {
      name: "编辑",
      permission: "system-api-edit",
      key: "edit",
      style: {},
    },
    {
      name: "删除",
      permission: "system-api-del",
      key: "del",
      style: { color: "rgb(245 108 108)" },
    },
  ],
  // --------------其他参数--------------
  modalArguments: {
    delete: {
      title: "请问是否要删除该记录？",
    },
  },
};

export const tableOption = {
  id: "api",
  border: "inner", // 是否带有边框(default, full, outer, inner, none)
  loading: false, // 表格是否显示加载中
  printConfig: {}, // 打印配置项
  importConfig: {}, // 导入配置项
  exportConfig: {}, // 导出配置项
  // 个性化信息配置项
  customConfig: {
    storage: true, // 是否启用 localStorage 本地保存
  },

  // 工具栏配置
  toolbarConfig: {
    // 顶部按钮配置
    buttons: [
      {
        code: "add",
        name: "新增",
        status: "primary",
        visible: checkPermission("system-api-add"),
      },
      {
        code: "dels",
        name: "批量删除",
        status: "danger",
        visible: checkPermission("system-api-dels"),
      },
    ],
    import: false, // 开启导入功能
    export: true, // 开启导出功能
    print: true, // 开启打印功能
    zoom: true, // 开启全屏功能
    custom: true, // 开启个性化配置
  },
  columns: [
    {
      field: "apiGroup",
      title: "Api组",
      showHeaderOverflow: true,
      resizable: true,
    },
    {
      field: "method",
      title: "方法类型",
      showHeaderOverflow: true,
      resizable: true,
    },
    {
      field: "path",
      title: "Api路径",
      showHeaderOverflow: true,
      resizable: true,
    },
    {
      field: "description",
      title: "中文描述",
      showHeaderOverflow: true,
      resizable: true,
    },
    {
      field: "action",
      title: "操作",
      slots: { default: "name" },
      showHeaderOverflow: true,
      resizable: true,
    },
  ],
};
