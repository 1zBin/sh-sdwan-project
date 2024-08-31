<script setup lang="ts">
import type { CommonPageData } from "@/types";
import { getBackupList, restore } from "@/api/device/backupRestore";
import BackupRestoreForm from "./components/backup-restore-form.vue";
const props = defineProps({
  popId: {
    type: Number,
    required: true,
  },
});

interface DialogForm {
  editShow: (id: number) => void;
}

const showDialog = ref(false);
const dialogForm = ref<DialogForm | null>(null);
const pageData = ref<CommonPageData>({
  page: 1,
  pageSize: 10,
  popDevID: props.popId,
});
const tableData = ref<any>([]);
const tableDataConfig = {
  // --------------页面标识---------------
  name: "pop-backup-restore",

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
const gridOptions = reactive({
  id: "pop-backup-restore",
  border: "inner",
  loading: false,
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
      width: 200,
    },
    {
      field: "CreatedAt",
      title: "备份时间",
      slots: { default: "name" },
      minWidth: 200,
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
      width: 200,
    },
  ],
});

onMounted(() => {
  getAllBackupList();
});

const getAllBackupList = async () => {
  try {
    gridOptions.loading = true;
    const res = await getBackupList(pageData.value);
    tableData.value = res.data.data.list;
    pageData.value.total = res.data.data.total;
    console.log("tableData", tableData.value);
    // 如果当前页面删除至没有数据(第一页除外)，则跳转到上一页
    if (
      pageData.value.page &&
      pageData.value.page > 1 &&
      tableData.value.length === 0
    ) {
      pageData.value.page = pageData.value.page - 1;
      getAllBackupList();
    }
    gridOptions.loading = false;
  } catch (error) {
    gridOptions.loading = false;
    console.log("error", error);
  }
};

// 分页跳转函数
const handleTableChange = (currentPage: number, pageSize: number) => {
  pageData.value.page = currentPage;
  pageData.value.pageSize = pageSize;
  getAllBackupList();
};

// 备份
const handleBackup = () => {
  dialogForm.value?.editShow(props.popId);
  showDialog.value = true;
};

// 恢复
const handleRestore = (record: Record<string, any>) => {
  try {
    restore({
      popDevID: props.popId,
      backupID: record.id,
    }).then((res) => {
      if (res.data.code === 2000) {
        getAllBackupList();
      }
    });
  } catch (error) {
    console.log("error", error);
  }
};
</script>

<template>
  <div>
    <CommonTable
      v-model="tableData"
      :gridOptions="gridOptions"
      :tableConfig="tableDataConfig"
      :pageData="pageData"
      @handleTableChange="handleTableChange"
      @handleBackup="handleBackup"
      @handleRestore="handleRestore"
    />

    <!-- 备份/恢复弹窗 -->
    <BackupRestoreForm
      ref="dialogForm"
      v-model:show-dialog="showDialog"
      @refreshList="getAllBackupList()"
    ></BackupRestoreForm>
  </div>
</template>

<style lang="scss" scoped></style>
