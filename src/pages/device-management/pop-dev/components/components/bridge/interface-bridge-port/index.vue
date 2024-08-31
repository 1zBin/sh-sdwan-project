<script setup lang="ts">
import {
  getInterfaceBridgePortList,
  removeInterfaceBridgePort,
} from "@/api/device/bridge.ts";
import AddDialog from "./components/add-interface-bridge-port.vue";
import { tableOption, tableDataConfig } from "./config/table.config";

const props = defineProps({
  interfaceBridgeID: {
    type: Number,
    required: true,
  },
  popId: {
    type: Number,
    required: true,
  },
  portListShow: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(["update:portListShow"]);

const isTableShow = computed({
  get: () => props.portListShow,
  set: (val) => emits("update:portListShow", val),
});

interface DialogForm {
  editShow: (record: any) => void;
  // 其他属性和方法的类型声明
}

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

    const res = await getInterfaceBridgePortList({
      interfaceBridgeID: props.interfaceBridgeID,
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
  const res = await removeInterfaceBridgePort({
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
</script>

<template>
  <a-modal
    width="70%"
    title="网桥接口列表"
    v-model:open="isTableShow"
    :destroyOnClose="true"
    :footer="null"
  >
    <CommonTable
      v-model="tableData"
      :gridOptions="gridOptions"
      :tableConfig="tableDataConfig"
      @handleDelete="handleDelete"
      @handleEdit="handleEdit"
      @handleAdd="handleAdd"
    />
    <!-- 新增/编辑弹窗 -->
    <AddDialog
      ref="dialogForm"
      v-model:show-dialog="showDialog"
      :popId="popId"
      :interfaceBridgeID="props.interfaceBridgeID"
      @refreshList="getAllInterfaceBridgePortList()"
    ></AddDialog>
  </a-modal>
</template>

<style scoped></style>
