import { checkPermission } from "~@/utils/checkPermission";

export const tableDataConfig = {
  // --------------页面标识---------------
  name: "operation-record",

  // --------------bodyCell参数--------------
  action: [
    {
      name: "删除",
      permission: "system-operation-record-del",
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
  id: "operation-record",
  border: "inner", // 是否带有边框(default, full, outer, inner, none)
  loading: false, // 表格是否显示加载中
  // 树形结构配置项
  treeConfig: {
    transform: true, // 自动将列表转为树结构（支持虚拟滚动）
    accordion: true, // 对于同一级的节点，每次只能展开一个
  },
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
      // {
      //   code: "add",
      //   name: "新增",
      //   status: "primary",
      //   visible: checkPermission("system-operation-record-add"),
      // },
      {
        code: "dels",
        name: "批量删除",
        status: "danger",
        visible: checkPermission("system-operation-record-dels"),
      },
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
      title: "操作人",
    },
    {
      field: "CreatedAt",
      title: "日期",
      slots: { default: "name" },
      width: 200,
    },
    {
      field: "code",
      title: "状态码",
    },
    {
      field: "ip",
      title: "请求IP",
    },
    {
      field: "method",
      title: "请求方法",
    },
    {
      field: "path",
      title: "请求路径",
      showOverflow: true,
      width: 300,
    },
    {
      field: "latency",
      title: "延迟(ms)",
    },
    {
      field: "reqBody",
      title: "请求",
      slots: { default: "name" },
    },
    {
      field: "respBody",
      title: "响应",
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
