<template>
  <simple-page :current="current">
    <a-card>
      <a-tabs v-model:activeKey="activeKey" @change="tabChange(activeKey)">
        <a-tab-pane key="route" tab="配置路由">
          <IpRoute :cpeId="cpeId" />
        </a-tab-pane>
        <a-tab-pane key="addToPop" tab="添加到POP设备"
          ><AddToPop
            ref="addToPopRef"
            v-model:collapseKey="collapseKey"
            :cpeId="cpeId"
        /></a-tab-pane>
        <a-tab-pane key="configLan" tab="配置LAN口"
          ><ConfigLan
            ref="configLanRef"
            v-model:collapseKey="collapseKey"
            :cpeId="cpeId"
        /></a-tab-pane>
        <a-tab-pane key="configWan" tab="配置WAN口" force-render
          ><ConfigWan
            ref="configWanRef"
            v-model:collapseKey="collapseKey"
            :cpeId="cpeId"
        /></a-tab-pane>
        <a-tab-pane key="bridge" tab="网桥接口" force-render
          ><Bridge ref="bridge" :cpeId="cpeId"
        /></a-tab-pane>
        <a-tab-pane key="dns" tab="DNS">
          <Dns :cpeId="cpeId" />
        </a-tab-pane>
        <a-tab-pane key="backupRestore" tab="备份与恢复" force-render
          ><BackupRestore ref="backupRestore" :cpeId="cpeId"
        /></a-tab-pane>
      </a-tabs>
    </a-card>
  </simple-page>
</template>
<script lang="ts" setup>
import emitter from "~@/utils/eventbus";
import IpRoute from "./components/route/index.vue";
import AddToPop from "./components/add-to-pop.vue";
import ConfigLan from "./components/config-lan.vue";
import ConfigWan from "./components/config-wan.vue";
import Bridge from "./components/bridge/index.vue";
import Dns from "./components/dns/index.vue";
import BackupRestore from "./components/backup-restore.vue";
import { toNumber } from "lodash";

type Key =
  | "route"
  | "addToPop"
  | "configWan"
  | "configLan"
  | "bridge"
  | "dns"
  | "backupRestore";
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

const addToPopRef = ref<ConfigRef | null>(null);
const configLanRef = ref<ConfigRef | null>(null);
const configWanRef = ref<ConfigRef | null>(null);
const route = useRoute();
const cpeId = ref(toNumber(route.params.id));
const collapseKey = ref([""]);
const currentData: CurrentData = {
  route: {
    name: "Route",
    title: "配置路由",
    path: "/device-management/cpe-dev/ip-route/:_",
    isBlack: true,
    goBlackPath: "/device-management/cpe-dev",
    matched: [
      {
        name: "DeviceManagement",
        title: "设备管理",
        path: "/device-management",
      },
      {
        name: "CpeDev",
        title: `${route.params.name}`,
        path: "/device-management/cpe-dev",
      },
    ],
  },
  addToPop: {
    name: "AddToPop",
    title: "添加到POP设备",
    path: "/device-management/cpe-dev/add-to-pop/:_",
    isBlack: true,
    goBlackPath: "/device-management/cpe-dev",
    matched: [
      {
        name: "DeviceManagement",
        title: "设备管理",
        path: "/device-management",
      },
      {
        name: "CpeDev",
        title: `${route.params.name}`,
        path: "/device-management/cpe-dev",
      },
    ],
  },
  configWan: {
    name: "CpeConfigWan",
    title: "配置Wan口",
    path: "/device-management/cpe-dev/config-wan/:_",
    isBlack: true,
    goBlackPath: "/device-management/cpe-dev",
    matched: [
      {
        name: "DeviceManagement",
        title: "设备管理",
        path: "/device-management",
      },
      {
        name: "CpeDev",
        title: `${route.params.name}`,
        path: "/device-management/cpe-dev",
      },
    ],
  },
  configLan: {
    name: "CpeConfigLan",
    title: "配置Lan口",
    path: "/device-management/cpe-dev/config-lan/:_",
    isBlack: true,
    goBlackPath: "/device-management/cpe-dev",
    matched: [
      {
        name: "DeviceManagement",
        title: "设备管理",
        path: "/device-management",
      },
      {
        name: "CpeDev",
        title: `${route.params.name}`,
        path: "/device-management/cpe-dev",
      },
    ],
  },
  bridge: {
    name: "bridge",
    title: "网桥接口",
    path: "/device-management/cpe-dev/bridge/:_",
    isBlack: true,
    goBlackPath: "/device-management/cpe-dev",
    matched: [
      {
        name: "DeviceManagement",
        title: "设备管理",
        path: "/device-management",
      },
      {
        name: "CpeDev",
        title: `${route.params.name}`,
        path: "/device-management/cpe-dev",
      },
    ],
  },
  dns: {
    name: "Dns",
    title: "DNS",
    path: "/device-management/cpe-dev/dns/:_",
    isBlack: true,
    goBlackPath: "/device-management/cpe-dev",
    matched: [
      {
        name: "DeviceManagement",
        title: "设备管理",
        path: "/device-management",
      },
      {
        name: "CpeDev",
        title: `${route.params.name}`,
        path: "/device-management/cpe-dev",
      },
    ],
  },
  backupRestore: {
    name: "BackupRestore",
    title: "备份与恢复",
    path: "/device-management/cpe-dev/backup-restore/:_",
    isBlack: true,
    goBlackPath: "/device-management/cpe-dev",
    matched: [
      {
        name: "DeviceManagement",
        title: "设备管理",
        path: "/device-management",
      },
      {
        name: "CpeDev",
        title: `${route.params.name}`,
        path: "/device-management/cpe-dev",
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
  addToPopRef.value?.clickCancel();
  configLanRef.value?.clickCancel();
  configWanRef.value?.clickCancel();
};

onUnmounted(() => {
  emitter.off("refreshTableData");
  console.log("销毁了当前页面的emitter", emitter.all);
});
</script>
