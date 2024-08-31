import { message } from "ant-design-vue/es";
import type { RouteLocationNormalizedLoaded } from "vue-router";
import router from "~@/router";

export interface MultiTabItem {
  path: string;
  fullPath: string;
  title: string;
  name?: string;
  icon?: string;
  // 判断当前是不是一个固定的标签
  affix?: boolean;
  loading?: boolean;
}

export const useMultiTab = defineStore("multi-tab", () => {
  const list = ref<MultiTabItem[]>([]);
  const activeKey = shallowRef();
  const addItem = (route: RouteLocationNormalizedLoaded) => {
    if (!route) return;
    // 判断是不是重定向的地址，如果是重定向或者登录页，那么就不进行处理
    if (route.path.startsWith("/redirect") || route.path === "/Login") return;

    if (list.value.some((item) => item.fullPath === route.fullPath)) return;

    // 判断是否存在同名的标签
    const sameNameIndex = list.value.findIndex(
      (item) => item.name === route.name
    );
    // 如果存在同名的标签，那么就删除之前那个标签页
    if (sameNameIndex > -1) {
      list.value.splice(sameNameIndex, 1);
    }

    const item: MultiTabItem = {
      path: route.path,
      fullPath: route.fullPath,
      title: route.meta.title as string,
      name: route.name as string,
      icon: route.meta.icon,
      affix: route.meta.affix,
      loading: false,
    };
    list.value.push(item);
  };

  const close = (key: string) => {
    // 判断长度是不是小于等于1，如果是那么这个就不能被关闭
    if (list.value.length <= 1) {
      message.error("不能关闭最后一个标签页");
      return;
    }
    const index = list.value.findIndex((item) => item.fullPath === key);
    if (index < 0) {
      message.error("当前页签不存在无法关闭");
      return;
    }
    const item = list.value[index];
    // 需要判断当前的标签是不是被选中，如果是，还需要判断当前是不是第一个页签，如果是，那么久需要激活上一个页签，如果不是，那就需要激活下一个页签
    if (item.fullPath === activeKey.value) {
      const newItem =
        index === 0 ? list.value[index + 1] : list.value[index - 1];
      activeKey.value = newItem.fullPath;
      router.push(newItem.fullPath);
    }
    list.value = list.value.filter((item) => item.fullPath !== key);
  };

  const refresh = (key: string) => {
    const page = list.value.find((val) => (val.path = key));
    if (page) {
      page.loading = true;
      router.replace(`/redirect/${encodeURIComponent(key)}`);
      page.loading = false;
    } else {
      router.replace(`/redirect/${encodeURIComponent(key)}`);
    }
  };

  const switchTab = (key: string) => {
    router.push(key);
  };

  const closeOther = (key: string) => {
    switchTab(key);
    list.value.forEach((item) => {
      if (item.affix) return;
      if (item.fullPath === key) return;
      close(item.fullPath);
    });
  };

  const clearAllTab = () => {
    list.value = [];
  };

  watch(
    router.currentRoute,
    (route) => {
      if (route.fullPath === activeKey.value) return;
      activeKey.value = route.fullPath;
      addItem(route);
    },
    { immediate: true }
  );
  return {
    list,
    activeKey,
    close,
    refresh,
    switchTab,
    closeOther,
    clearAllTab,
  };
});
