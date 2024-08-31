import type { LayoutSetting } from "@/stores";

export default {
  title: "SDWan管理系统",
  theme: "light", // 主题风格
  logo: "https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg",
  collapsed: false, // 菜单栏是否折叠
  drawerVisible: false, // 右侧工具栏是否隐藏
  colorPrimary: "#1677FF", // 主题色
  layout: "mix", // 导航模式
  contentWidth: "Fluid", // 内容区域宽度
  fixedHeader: false, // 固定Header
  fixedSider: true, // 固定侧边菜单
  splitMenus: false, // 自动分割菜单
  header: true, // 顶栏
  menu: true, // 菜单
  menuHeader: true, // 菜单头
  footer: false, // 页脚
  colorWeak: false, // 色弱
  multiTab: true, // 多页标签
  multiTabFixed: false, // 固定多页标签
  headerHeight: 48, // 顶部高度
  copyright: "", // 页脚的版权信息
} as LayoutSetting;
