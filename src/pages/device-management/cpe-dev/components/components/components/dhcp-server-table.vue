<script lang="ts" setup>
import { getIpDhcpServerList } from "@/api/cpe/cpeDev";
import emitter from "~@/utils/eventbus";

const props = defineProps({
  cpeId: {
    type: Number,
    required: true,
  },
});

const tableData = ref<any>([]);
const columns = [
  {
    field: "name",
    title: "名称",
  },
  {
    field: "poolName",
    title: "地址池名称",
  },
  {
    field: "devPort",
    title: "设备接口",
  },
  {
    field: "leaseTime",
    title: "租用时间",
  },
  {
    field: "disabled",
    title: "是否禁用",
    slots: { default: "name" },
  },
  {
    field: "comment",
    title: "备注",
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
  getAllIpDhcpServerList();
});

const getAllIpDhcpServerList = async () => {
  try {
    gridConfigs.loading = true;
    const res = await getIpDhcpServerList({
      cpeId: props.cpeId,
    });
    tableData.value = res.data.data;
    gridConfigs.loading = false;
    // console.log("getIpDhcpServerList", tableData.value);
  } catch (error) {
    gridConfigs.loading = false;
    console.log("error", error);
  }
};

// 刷新表格
const refreshTableData = (types: string[] | undefined) => {
  if (types?.includes("dhcpServer")) {
    getAllIpDhcpServerList();
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
      <template #name="{ row, column }">
        <template v-if="column.field === 'disabled'">
          <span v-if="row.disabled === 'yes'">是</span>
          <span v-else>否</span>
        </template>
      </template>
    </vxe-grid>
  </div>
</template>
