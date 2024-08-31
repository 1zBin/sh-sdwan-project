export const tableDataConfig = {
  // --------------页面标识---------------
  name: "uninitialized-cpe-dev",
  // --------------bodyCell参数--------------
  action: [
    {
      name: "添加CPE设备",
      permission: "defaultTrue",
      key: "addCpe",
      style: {},
    },
  ],
  // --------------其他参数--------------
  modalArguments: {},
};

export const tableOption = {
  id: "uninitialized-cpe-dev",
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
      field: "hostName",
      title: "主机名",
    },
    {
      field: "ip",
      title: "IP",
    },
    {
      field: "clientId",
      title: "客户ID",
    },
    {
      field: "mac",
      title: "Mac",
    },
    {
      field: "count",
      title: "数量",
    },
    {
      field: "failureReason",
      title: "失败原因",
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
