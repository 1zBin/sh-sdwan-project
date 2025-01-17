import {
  arrayType,
  booleanType,
  eventType,
  numberType,
  stringType,
} from "@v-c/utils";
import type { ExtractPropTypes, VNodeChild } from "vue";
import { Meta } from "@/types";

export type MenuData = MenuDataItem[];

export interface MenuDataItem {
  // 标题
  title: string | (() => VNodeChild);
  // 图标
  icon?: string | (() => VNodeChild);
  // 地址
  path: string;
  // 子集菜单
  children?: MenuDataItem[] | any;
  // 同路由中的name，主要是用于保活的左右
  name?: string;
  // 是否隐藏当前菜单
  hideInMenu?: boolean;
  // 如果使用了隐藏，那么点击当前菜单的时候，可以使用父级的key
  parentKeys?: string[];
  // 是否套用iframe
  isIframe?: boolean;
  // 如果当前是iframe的模式，需要有一个跳转的url支撑，其不能和path重复，path还是为路由
  url?: string;
  // 是否存在面包屑
  hideInBreadcrumb?: boolean;
  // 是否需要显示所有的子菜单
  hideChildrenInMenu?: boolean;
  // 是否保活
  keepAlive?: boolean;
  // 这里包含所有的父级元素
  matched?: MenuDataItem[];
  // 全连接跳转模式
  target?: "_blank" | "_self" | "_parent";
  component?: any;
  redirect?: string | undefined;
  meta?: Meta | undefined;
}

export type LayoutType = "mix" | "side" | "top";

export type ThemeType = "light" | "dark" | "inverted";

export type ContentWidth = "Fluid" | "Fixed";

export interface MenuSelectEvent {
  item: any;
  key: string;
  selectedKeys: string[];
}

const proLayoutEvents = {
  "onUpdate:openKeys": eventType<(val: string[]) => void>(),
  "onUpdate:selectedKeys": eventType<(val: string[]) => void>(),
  onMenuSelect: eventType<(data: MenuSelectEvent) => void>(),
};

export const proLayoutProps = {
  layout: stringType<LayoutType>("mix"),
  logo: stringType(),
  title: stringType(),
  collapsedWidth: numberType(48),
  siderWidth: numberType(248),
  headerHeight: numberType(48),
  menuData: arrayType<MenuData>(),
  fixedHeader: booleanType<boolean>(false),
  fixedSider: booleanType<boolean>(true),
  splitMenus: booleanType(),
  collapsed: booleanType<boolean>(false),
  theme: stringType<ThemeType>("light"),
  onCollapsed: eventType<(collapsed: boolean) => void>(),
  isMobile: booleanType(),
  contentWidth: stringType<ContentWidth>(),
  header: booleanType<boolean>(true),
  footer: booleanType<boolean>(true),
  menu: booleanType<boolean>(true),
  menuHeader: booleanType<boolean>(true),
  // 展开菜单
  openKeys: arrayType<string[]>(),
  // 选中菜单
  selectedKeys: arrayType<string[]>(),
  copyright: stringType(),
  ...proLayoutEvents,
};

export type ProLayoutProps = Partial<ExtractPropTypes<typeof proLayoutProps>>;
