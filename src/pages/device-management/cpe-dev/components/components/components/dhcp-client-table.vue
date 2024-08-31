<script lang="ts" setup>
import { getIpDhcpClientList } from "@/api/cpe/cpeDev";
import emitter from "@/utils/eventbus";

const props = defineProps({
  cpeId: {
    type: Number,
    required: true,
  },
  configBelong: {
    type: String,
    required: true,
  },
});

const tableData = ref<any>([]);
const columns = [
  {
    field: "devPort",
    title: "设备接口",
  },
  {
    field: "disabled",
    title: "是否禁用",
    slots: { default: "name" },
  },
  {
    field: "defaultRouteDistance",
    title: "默认管理距离",
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
  getAllIpDhcpClientList();
});

const getAllIpDhcpClientList = async () => {
  try {
    gridConfigs.loading = true;
    const res = await getIpDhcpClientList({
      cpeId: props.cpeId,
      configBelong: props.configBelong,
    });
    tableData.value = res.data.data;
    gridConfigs.loading = false;
    // console.log("getIpDhcpClientList", tableData.value);
  } catch (error) {
    gridConfigs.loading = false;
    console.log("error", error);
  }
};

// 刷新表格
const refreshTableData = (types: string[] | undefined) => {
  if (types?.includes("dhcpClient")) {
    getAllIpDhcpClientList();
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
