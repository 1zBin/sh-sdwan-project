<template>
  <simple-page :current="current">
    <a-card>
      <a-tabs v-model:activeKey="activeKey" @change="tabChange(activeKey)">
        <a-tab-pane key="route" tab="配置路由" force-render>
          <IpRoute :popId="popId" />
        </a-tab-pane>
        <a-tab-pane key="configWan" tab="配置WAN口" force-render
          ><ConfigWan
            ref="configWanRef"
            v-model:collapseKey="collapseKey"
            :popId="popId"
        /></a-tab-pane>
        <a-tab-pane key="bridge" tab="网桥接口" force-render
          ><Bridge ref="bridge" :popId="popId"
        /></a-tab-pane>
        <a-tab-pane key="backupRestore" tab="备份与恢复" force-render
          ><BackupRestore ref="backupRestore" :popId="popId"
        /></a-tab-pane>
      </a-tabs>
    </a-card>
  </simple-page>
</template>
<script lang="ts" setup>
import emitter from "~@/utils/eventbus";
import ConfigWan from "./components/config-wan.vue";
import BackupRestore from "./components/backup-restore.vue";
import Bridge from "./components/bridge/index.vue";
import IpRoute from "./components/route/index.vue";
import { toNumber } from "lodash";

type Key = "route" | "configWan" | "backupRestore" | "bridge";
interface Current {
  name: string;
  title: string;
  path: string;
  isBlack: boolean;
  goBlackPath: string;
  matched: {
    name: string;
    title: string;
    path: string;
  }[];
}
interface CurrentData {
  [key: string]: Current;
}
interface ConfigRef {
  clickCancel: () => void;
}

const configWanRef = ref<ConfigRef | null>(null);
const route = useRoute();
const popId = ref(toNumber(route.params.id));
const collapseKey = ref([""]);

const currentData: CurrentData = {
  route: {
    name: "Route",
    title: "配置路由",
    path: "/device-management/pop-dev/ip-route/:_",
    isBlack: true,
    goBlackPath: "/device-management/pop-dev",
    matched: [
      {
        name: "DeviceManagement",
        title: "设备管理",
        path: "/device-management",
      },
      {
        name: "PopDev",
        title: `${route.params.name}`,
        path: "/device-management/pop-dev",
      },
    ],
  },
  configWan: {
    name: "ConfigWan",
    title: "配置Wan口",
    path: "/device-management/pop-dev/config-wan/:_",
    isBlack: true,
    goBlackPath: "/device-management/pop-dev",
    matched: [
      {
        name: "DeviceManagement",
        title: "设备管理",
        path: "/device-management",
      },
      {
        name: "PopDev",
        title: `${route.params.name}`,
        path: "/device-management/pop-dev",
      },
    ],
  },
  bridge: {
    name: "Bridge",
    title: "网桥接口",
    path: "/device-management/pop-dev/bridge/:_",
    isBlack: true,
    goBlackPath: "/device-management/pop-dev",
    matched: [
      {
        name: "DeviceManagement",
        title: "设备管理",
        path: "/device-management",
      },
      {
        name: "PopDev",
        title: `${route.params.name}`,
        path: "/device-management/pop-dev",
      },
    ],
  },

  backupRestore: {
    name: "BackupRestore",
    title: "备份与恢复",
    path: "/device-management/pop-dev/backup-restore/:_",
    isBlack: true,
    goBlackPath: "/device-management/pop-dev",
    matched: [
      {
        name: "DeviceManagement",
        title: "设备管理",
        path: "/device-management",
      },
      {
        name: "PopDev",
        title: `${route.params.name}`,
        path: "/device-management/pop-dev",
      },
    ],
  },
};
const current = ref<Current>(currentData.route);
const activeKey = ref<Key>("route");
// 切换tab
const tabChange = (key: Key) => {
  current.value = currentData[key];
  collapseKey.value = [""];
  // 切换时清空每个表单数据
  configWanRef.value?.clickCancel();
};

onUnmounted(() => {
  emitter.off("refreshTableData");
  console.log("销毁了当前页面的emitter", emitter.all);
});
</script>
