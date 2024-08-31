import { checkPermission } from "~@/utils/checkPermission";

export const tableDataConfig = {
  // --------------页面标识---------------
  name: "pop-dev",

  // --------------bodyCell参数--------------
  action: [
    {
      name: "设备操作",
      permission: "device-management-pop-dev-operations",
      key: "operations",
      style: { color: "#0958d9" },
      options: [
        {
          value: "reboot",
          label: "重启设备",
        },
        {
          value: "shutdown",
          label: "设备关机",
        },
      ],
    },
    {
      name: "配置设备",
      permission: "device-management-pop-dev-settings",
      key: "settings",
      style: { color: "rgb(250, 173, 20)" },
      options: [
        {
          value: "confWan",
          label: "WAN口配置",
        },
      ],
    },
    {
      name: "详情",
      permission: "device-management-pop-dev-details",
      key: "details",
      style: { color: "#67c23a" },
    },
    {
      name: "编辑",
      permission: "device-management-pop-dev-edit",
      key: "edit",
      style: {},
    },
    {
      name: "删除",
      permission: "device-management-pop-dev-del",
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
  id: "pop-dev",
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
        visible: checkPermission("device-management-pop-dev-add"),
      },
      {
        code: "dels",
        name: "批量删除",
        status: "danger",
        visible: checkPermission("device-management-pop-dev-dels"),
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
      title: "设备名称",
    },
    {
      field: "priority",
      title: "Cpe连接优先级",
    },
    {
      field: "sshPort",
      title: "SSH端口",
    },
    {
      field: "sstpPort",
      title: "SstpVpn端口",
    },
    {
      field: "ovpnPort",
      title: "OpenVpn端口",
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
      width: 300,
    },
  ],
};
