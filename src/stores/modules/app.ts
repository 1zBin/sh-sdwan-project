import type { ThemeConfig } from "ant-design-vue/es/config-provider/context";
import { theme as antdTheme } from "ant-design-vue/es";
import type {
  ContentWidth,
  LayoutType,
  ThemeType,
} from "~@/layouts/basic-layout/typing";
import defaultSetting from "@/config/default-setting";

export interface LayoutSetting {
  title?: string;
  logo?: string;
  theme?: ThemeType;
  collapsed?: boolean;
  drawerVisible?: boolean;
  colorPrimary?: string;
  layout?: LayoutType;
  contentWidth?: ContentWidth;
  fixedHeader?: boolean;
  fixedSider?: boolean;
  splitMenus?: boolean;
  header?: boolean;
  footer?: boolean;
  menu?: boolean;
  menuHeader?: boolean;
  colorWeak?: boolean;
  multiTab?: boolean;
  multiTabFixed?: boolean;
  headerHeight?: number;
  copyright?: string;
}

export const useAppStore = defineStore("app", () => {
  const layoutSetting = ref<LayoutSetting>({});

  const value = localStorage.getItem("pageLayout");
  if (value === null) {
    layoutSetting.value = defaultSetting;
  } else {
    layoutSetting.value = JSON.parse(localStorage.getItem("pageLayout") as any);
  }

  const themeConfig = reactive<ThemeConfig>({
    algorithm: antdTheme.defaultAlgorithm,
    token: {
      colorBgContainer: "#fff",
      colorPrimary: layoutSetting.value.colorPrimary,
    },
    components: {},
  });
  const toggleTheme = (theme: ThemeType) => {
    if (layoutSetting.value.theme === theme) return;

    layoutSetting.value.theme = theme;
    if (theme === "light" || theme === "inverted") {
      if (themeConfig.token) themeConfig.token.colorBgContainer = "#fff";
      if (themeConfig.components?.Menu) delete themeConfig.components.Menu;

      themeConfig.algorithm = antdTheme.defaultAlgorithm;

      toggleDark(false);
    } else if (theme === "dark") {
      toggleDark(true);
      if (themeConfig.token)
        themeConfig.token.colorBgContainer = "rgb(36, 37, 37)";
      if (themeConfig.components) {
        themeConfig.components = {
          ...themeConfig.components,
          Menu: {
            colorItemBg: "rgb(36, 37, 37)",
            colorSubItemBg: "rgb(36, 37, 37)",
            menuSubMenuBg: "rgb(36, 37, 37)",
          } as any,
        };
      }
      themeConfig.algorithm = antdTheme.darkAlgorithm;
    }
  };

  const toggleDrawerVisible = (visible: boolean) => {
    layoutSetting.value.drawerVisible = visible;
  };

  const toggleColorPrimary = (color: string) => {
    layoutSetting.value.colorPrimary = color;
    if (themeConfig.token) themeConfig.token.colorPrimary = color;
  };

  // 如果加载进来是暗色模式，就切换到暗色模式
  if (isDark.value) toggleTheme("dark");

  const toggleCollapsed = (collapsed: boolean) => {
    layoutSetting.value.collapsed = collapsed;
  };

  const toggleLayout = (layout: LayoutType) => {
    if (layoutSetting.value.theme === "inverted" && layout === "mix")
      layoutSetting.value.theme = "light";

    if (layout !== "mix") layoutSetting.value.splitMenus = false;

    if (layout === "top") layoutSetting.value.contentWidth = "Fixed";
    else layoutSetting.value.contentWidth = "Fluid";

    layoutSetting.value.layout = layout;
  };

  const changeSettingLayout = async (key: keyof LayoutSetting, value: any) => {
    if (key === "theme") {
      toggleTheme(value as ThemeType);
    } else if (key === "colorPrimary") {
      toggleColorPrimary(value);
    } else if (key === "layout") toggleLayout(value as LayoutType);
    else if (key in layoutSetting.value)
      (layoutSetting.value as any)[key] = value;
  };

  const setLayoutSetting = (pageLayout: LayoutSetting) => {
    Object.entries(pageLayout).forEach(([key, value]) => {
      changeSettingLayout(key as keyof LayoutSetting, value);
    });
  };

  return {
    layoutSetting,
    theme: themeConfig,
    toggleTheme,
    toggleCollapsed,
    toggleDrawerVisible,
    changeSettingLayout,
    toggleColorPrimary,
    setLayoutSetting,
  };
});
