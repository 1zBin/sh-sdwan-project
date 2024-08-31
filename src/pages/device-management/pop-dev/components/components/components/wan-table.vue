<script lang="ts" setup>
import { getPopWanList } from "@/api/pop/popDev";
import emitter from "@/utils/eventbus";

const props = defineProps({
  popId: {
    type: Number,
    required: true,
  },
});

const tableData = ref<any>([]);
const columns = [
  {
    field: "ip",
    title: "IP",
  },
  {
    field: "domainName",
    title: "域名",
  },
  {
    field: "kind",
    title: "传输网络类型",
  },
  {
    field: "priority",
    title: "优先级",
  },
  {
    field: "port",
    title: "设备接口",
  },
];
const gridConfigs = reactive({
  id: "dhcp-client",
  loading: false,
  columnConfig: {
    resizable: true, // 每一列是否启用列宽调整
  },
});

onMounted(() => {
  getAllPopWanList();
});

const getAllPopWanList = async () => {
  try {
    gridConfigs.loading = true;
    const res = await getPopWanList({
      popDevID: props.popId,
    });
    tableData.value = res.data.data.popWanList;
    gridConfigs.loading = false;
    console.log("getPopWanList", tableData.value);
  } catch (error) {
    gridConfigs.loading = false;
    console.log("error", error);
  }
};

// 刷新表格
const refreshTableData = (types: string[] | undefined) => {
  if (types?.includes("popWan")) {
    getAllPopWanList();
  }
};
emitter.on("refreshTableData", refreshTableData);
</script>

<template>
  <div>
    <vxe-grid
      ref="gridTable"
      round
      max-height="400"
      v-bind="gridConfigs"
      :data="tableData"
      :columns="columns"
      :show-overflow="'tooltip'"
      :show-header-overflow="'tooltip'"
    >
    </vxe-grid>
  </div>
</template>
