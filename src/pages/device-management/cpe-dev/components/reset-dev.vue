<script setup lang="ts">
import { useSelectedRow } from "~@/stores";
import { getBackupList } from "@/api/device/backupRestore";
import { reset } from "@/api/device/devReboot.ts";
import { Form, message } from "ant-design-vue";
import type { CommonPageData } from "@/types";
import _ from "lodash";

const props = defineProps({
  radioTableShow: {
    type: Boolean,
    required: true,
  },
});
const emits = defineEmits([
  "update:radioTableShow",
  "update:modelValue",
  "refreshList",
]);

const tableShow = computed({
  get: () => props.radioTableShow,
  set: (val) => {
    emits("update:radioTableShow", val);
  },
});
const confirmLoading = ref(false);
const selectedRow = useSelectedRow();
const { modalTableIds, modalTableList } = toRefs(selectedRow);
const styleConfig = {
  type: "modalTable",
  size: "small",
  tableType: "radio",
  delAction: true,
  topBtnShow: "hidden",
  antCardStyle: {
    padding: "16px",
  },
};

const pageData = ref<CommonPageData>({
  page: 1,
  pageSize: 10,
  cpeDevID: undefined,
});
const tableData = ref<any>([]);
const tableDataConfig = {
  // --------------页面标识---------------
  name: "cpe-backup-restore",

  // --------------bodyCell参数--------------
  action: [
    {
      name: "恢复备份",
      permission: "defaultTrue",
      key: "restore",
      style: { color: "#67c23a" },
    },
  ],
  // --------------其他参数--------------
  modalArguments: {
    restore: {
      title: "请问是否要恢复此备份记录？",
    },
  },
};
const gridOptions = ref({
  id: "cpe-backup-restore",
  border: "inner",
  columnConfig: {
    resizable: true, // 每一列是否启用列宽调整
  },
  printConfig: {}, // 打印配置项
  importConfig: {}, // 导入配置项
  exportConfig: {}, // 导出配置项
  // 个性化信息配置项
  customConfig: {
    storage: true, // 是否启用 localStorage 本地保存
  },
  // 工具栏配置
  toolbarConfig: {
    // 顶部按钮配置
    buttons: [
      {
        code: "backup",
        name: "备份",
        status: "primary",
        visible: true,
      },
    ],
    import: false, // 开启导入功能
    export: true, // 开启导出功能
    print: true, // 开启打印功能
    zoom: true, // 开启全屏功能
    custom: true, // 开启个性化配置
  },
  columns: [
    {
      field: "logicBakFileName",
      title: "名称",
    },
    {
      field: "backupType",
      title: "备份类型",
      slots: { default: "name" },
    },
    {
      field: "CreatedAt",
      title: "备份时间",
      slots: { default: "name" },
    },
    {
      field: "comment",
      title: "备注",
    },
    {
      field: "action",
      title: "操作",
      slots: { default: "name" },
      fixed: "right", // 固定列在右侧
    },
  ],
});

onMounted(() => {
  getAllBackupList();
});

const getAllBackupList = async () => {
  try {
    const res = await getBackupList(pageData.value);
    tableData.value = res.data.data.list;
    console.log("getAllCpeAtPop", tableData.value);
  } catch (error) {
    console.log("error", error);
  }
};

const initValues = reactive<Record<string, any>>({
  backupID: undefined,
  devType: "cpe",
  devId: undefined,
});
const formData = ref(initValues);
const { resetFields } = Form.useForm(formData);

const editShow = async (data: Record<string, any>) => {
  formData.value.devId = data.id;
  pageData.value.cpeDevID = data.id;
  getAllBackupList();
};
// 主动暴露editShow方法
defineExpose({ editShow });

// 分页跳转函数
const handleTableChange = (currentPage: number, pageSize: number) => {
  pageData.value.page = currentPage;
  pageData.value.pageSize = pageSize;
  getAllBackupList();
};

// 确认按钮
const clickConfirm = async () => {
  try {
    if (!modalTableIds.value || modalTableIds.value.length === 0) {
      message.warning("请选择一条备份记录进行重置");
      return;
    } else {
      formData.value.backupID = modalTableIds.value[0];
    }

    let submitData = _.cloneDeep(formData.value);
    confirmLoading.value = true;
    const res = await reset(submitData);
    if (res.data.code === 2000) {
      clickCancel();
    }
    confirmLoading.value = false;
  } catch (error) {
    confirmLoading.value = false;
    console.log("error", error);
  }
};

// 关闭弹窗
const clickCancel = () => {
  resetFields();
  emits("refreshList");
  tableShow.value = false;
  modalTableIds.value = [];
  modalTableList.value = [];
};
</script>

<template>
  <!-- table弹窗 -->
  <a-modal
    style="width: 70%"
    centered
    v-model:open="tableShow"
    title="备份列表"
    :destroyOnClose="true"
    :confirm-loading="confirmLoading"
    @ok="clickConfirm"
    @cancel="clickCancel"
  >
    <!-- 表格部分 -->
    <CommonTable
      v-model="tableData"
      :gridOptions="gridOptions"
      :tableConfig="tableDataConfig"
      :pageData="pageData"
      :styleConfig="styleConfig"
      @handleTableChange="handleTableChange"
    />
  </a-modal>
</template>

<style lang="less" scoped>
:deep(.ant-table-pagination) {
  margin-bottom: 0px !important;
}
</style>
