import { checkPermission } from "~@/utils/checkPermission";

export const tableDataConfig = {
  // --------------页面标识---------------
  name: "initDhcp",
  // --------------bodyCell参数--------------
  action: [
    {
      name: "详情",
      permission: "initialize-initDhcp-details",
      key: "details",
      style: { color: "#67c23a" },
    },
    {
      name: "编辑",
      permission: "initialize-initDhcp-edit",
      key: "edit",
      style: {},
    },
    {
      name: "删除",
      permission: "initialize-initDhcp-del",
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
  id: "initDhcp",
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
        visible: checkPermission("initialize-initDhcp-add"),
      },
      {
        code: "dels",
        name: "批量删除",
        status: "danger",
        visible: checkPermission("initialize-initDhcp-dels"),
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
      field: "name",
      title: "名称",
    },
    {
      field: "brand",
      title: "品牌",
    },
    {
      field: "modelNumber",
      title: "型号",
    },
    {
      field: "sn",
      title: "SN号",
    },
    {
      field: "sshPort",
      title: "SSH端口",
    },
    {
      field: "apiPort",
      title: "API端口文明传输",
    },
    {
      field: "osVersion",
      title: "版本号",
    },
    {
      field: "useTls",
      title: "是否启用TLS",
      slots: { default: "name" },
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
