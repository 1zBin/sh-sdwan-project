<script lang="ts" setup>
import { getCpeAtPop } from "@/api/cpe/cpeDev";
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
    field: "popName",
    title: "已添加POP设备名称",
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
  getAllCpeAtPop();
});

const getAllCpeAtPop = async () => {
  try {
    gridConfigs.loading = true;
    const res = await getCpeAtPop({
      id: props.cpeId,
    });
    tableData.value = res.data.data;
    gridConfigs.loading = false;
    // console.log("getAllCpeAtPop", tableData.value);
  } catch (error) {
    gridConfigs.loading = false;
    console.log("error", error);
  }
};

// 刷新表格
const refreshTableData = (types: string[] | undefined) => {
  if (types?.includes("cpeAtPop")) {
    getAllCpeAtPop();
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
