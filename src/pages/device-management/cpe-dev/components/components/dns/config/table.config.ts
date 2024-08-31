export const tableDataConfig = {
  // --------------页面标识---------------
  name: "dns",
  // --------------bodyCell参数--------------
  action: [
    {
      name: "编辑",
      permission: "defaultTrue",
      key: "edit",
      style: {},
    },
    {
      name: "删除",
      permission: "defaultTrue",
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
  id: "dns",
  border: "inner",
  loading: false,
  columnConfig: {
    resizable: true, // 每一列是否启用列宽调整
  },
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
      },
      {
        code: "dels",
        name: "批量删除",
        status: "danger",
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
      field: "regexp",
      title: "主机名",
    },
    {
      field: "forwardTo",
      title: "转发到目标地址",
    },
    {
      field: "disabled",
      title: "是否禁用",
      slots: { default: "name" },
    },
    {
      field: "comment",
      title: "备注",
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
