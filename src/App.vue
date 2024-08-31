<script setup lang="ts">
import { useAppStore } from "@/stores";
import zhCN from "ant-design-vue/es/locale/zh_CN";
const appStore = useAppStore();

const getPopupContainer = (trigger: any) => {
  if (trigger) {
    return trigger.parentNode;
  } else {
    return document.body;
  }
};
</script>

<template>
  <a-config-provider
    :theme="appStore.theme"
    :getPopupContainer="(getPopupContainer as any)"
    :locale="zhCN"
  >
    <RouterView />
  </a-config-provider>
</template>
