interface DetailsKeys {
  [key: string]: string;
}

export const detailsKeys: DetailsKeys = {
  name: "名称",
  brand: "品牌",
  modelNumber: "型号",
  belongTo: "设备来源",
  status: "状态",
  active: "是否可用",
  disabled: "是否禁用",
  /* -------------------------------------- */

  cpu: "CPU",
  mem: "内存",
  hd: "硬盘",
  manageIP: "管理IP",
  manageAccount: "管理账号",
  managePassword: "管理密码",
  apiPort: "API端口文明传输",
  apisPort: "API-SSL端口加密传输",
  sshPort: "SSH端口",
  ovpnPort: "SSH端口",
  sstpPort: "SSH端口",
  priority: "CPE连接优先级",
  popKind: "POP类型",
  popWan: "WAN口",
  cpeDev: "CPE设备",
  adminAddressPool: "管理IP地址池",
  connAddressPool: "互联IP地址池",
  backupRestore: "设备备份",
  IpDhcpClient: "IpDhcpClient",
  IpAddress: "IP地址",
  IpRoute: "IP路由",
  InterfacePppoeClient: "InterfacePppoeClient",
  InterfaceBridge: "自定义接口",
  PppProfile: "PppProfile",
  PppSecret: "PppSecret",
  ipPool: "IP池",
  sim: "移动网络",
  wifi: "WIFI",

  useTls: "是否启用TLS",
  osVersion: "版本号",
  sn: "SN号",

  /* -------------------------------------- */
  address: "地址",
  identifier: "资产编号",
  warranty: "保修日期",
  comment: "备注",
};
