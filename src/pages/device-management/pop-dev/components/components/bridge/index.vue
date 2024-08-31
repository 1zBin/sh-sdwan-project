<script setup lang="ts">
import {
  getInterfaceBridgeList,
  removeInterfaceBridge,
} from "@/api/device/bridge.ts";
import AddDialog from "./components/add-interface-bridge.vue";
import InterfaceBridgePort from "./interface-bridge-port/index.vue";
import { tableOption, tableDataConfig } from "./config/table.config";

const props = defineProps({
  popId: {
    type: Number,
    required: true,
  },
});

interface DialogForm {
  editShow: (record: any) => void;
  // 其他属性和方法的类型声明
}

const portListShow = ref(false);
const showDialog = ref(false);
const dialogForm = ref<DialogForm | null>(null);
const gridOptions = ref<any>(tableOption);
const tableData = ref([]);

onMounted(() => {
  getAllInterfaceBridgePortList();
});

// 获取列表
const getAllInterfaceBridgePortList = async () => {
  try {
    gridOptions.value.loading = true;

    const res = await getInterfaceBridgeList({
      popDevID: props.popId,
    });
    tableData.value = res.data.data;
    console.log("InterfaceList", tableData.value);
    gridOptions.value.loading = false;
  } catch (error) {
    gridOptions.value.loading = false;
  }
};

// 新增
const handleAdd = () => {
  showDialog.value = true;
};

// 删除
const handleDelete = async (record: Record<string, any>) => {
  const res = await removeInterfaceBridge({
    id: record.id,
    popDevID: props.popId,
  });
  if (res.data.code === 2000) getAllInterfaceBridgePortList();
};

// 编辑
const handleEdit = (record: Record<string, any>) => {
  console.log("编辑", record);
  dialogForm.value?.editShow(record);
  showDialog.value = true;
};

// 打开网桥接口列表
const interfaceBridgeID = ref(0);
const handlePortList = (record: Record<string, any>) => {
  console.log("打开网桥接口列表", record);
  interfaceBridgeID.value = record.id;
  portListShow.value = true;
};
</script>

<template>
  <CommonTable
    v-model="tableData"
    :gridOptions="gridOptions"
    :tableConfig="tableDataConfig"
    @handleDelete="handleDelete"
    @handleEdit="handleEdit"
    @handleAdd="handleAdd"
    @handlePortList="handlePortList"
  />
  <!-- 新增/编辑弹窗 -->
  <AddDialog
    ref="dialogForm"
    v-model:show-dialog="showDialog"
    :popId="props.popId"
    @refreshList="getAllInterfaceBridgePortList()"
  ></AddDialog>

  <!-- 网桥接口列表 -->
  <template v-if="portListShow">
    <InterfaceBridgePort
      :interfaceBridgeID="interfaceBridgeID"
      :popId="props.popId"
      v-model:portListShow="portListShow"
    />
  </template>
</template>

<style scoped></style>
