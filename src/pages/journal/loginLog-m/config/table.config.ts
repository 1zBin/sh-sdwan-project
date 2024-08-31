export const tableDataConfig = {
  // --------------页面标识---------------
  name: "loginLog-m",
};

export const tableOption = {
  id: "loginLog-m",
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
    buttons: [],
    import: false, // 开启导入功能
    export: true, // 开启导出功能
    print: true, // 开启打印功能
    zoom: true, // 开启全屏功能
    custom: true, // 开启个性化配置
  },
  columns: [
    {
      field: "userName",
      title: "用户名",
    },
    {
      field: "loginMode",
      title: "登录模式",
    },
    {
      field: "ip",
      title: "登录IP",
    },
    {
      field: "loginTime",
      title: "登录时间",
      slots: { default: "name" },
    },
    {
      field: "status",
      title: "登录状态",
    },
    {
      field: "msg",
      title: "登录提示",
      slots: { default: "name" },
    },
  ],
};
