<script setup lang="ts">
import {
  deletePopDev,
  deletePopDevByIds,
  getPopDevList,
} from "@/api/pop/popDev";
import { reboot, shutdown } from "@/api/device/devReboot.ts";
import type { CommonPageData } from "@/types";
import AddDialog from "./components/add-pop-dev.vue";
import { tableOption, tableDataConfig } from "./config/table.config";
import { topToolsConfig } from "./config/tools.config";
import { setTableOption } from "~@/utils/tableConfig";

const props = defineProps({
  styleConfig: {
    type: Object,
    required: false,
    default: () => ({}),
  },
});

interface DialogForm {
  editShow: (record: any) => void;
  // 其他属性和方法的类型声明
}

const router = useRouter();
const showDialog = ref(false);
const dialogForm = ref<DialogForm | null>(null);
const gridOptions = ref<any>(setTableOption(tableOption, "checkbox"));
const tableData = ref([]);
const detailsShow = ref(false);
const detailsContent = ref({});

const pageData = ref<CommonPageData>({
  page: 1,
  pageSize: 10,
  total: 0,
});

onMounted(() => {
  getAllPopDevList();
});

// 获取列表
const getAllPopDevList = async () => {
  try {
    gridOptions.value.loading = true;
    const res = await getPopDevList(pageData.value);
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
      getAllPopDevList();
    }
    gridOptions.value.loading = false;
  } catch (error) {
    gridOptions.value.loading = false;
  }
};

// 分页跳转函数
const handleTableChange = (currentPage: number, pageSize: number) => {
  pageData.value.page = currentPage;
  pageData.value.pageSize = pageSize;
  getAllPopDevList();
};

// 新增
const handleAdd = () => {
  showDialog.value = true;
};

// 删除
const handleDelete = async (record: Record<string, any>) => {
  const res = await deletePopDev({ id: record.id });
  if (res.data.code === 2000) getAllPopDevList();
};

// 批量删除
const handleDeletes = async (ids: number[]) => {
  const res = await deletePopDevByIds({ ids: ids });
  if (res.data.code === 2000) getAllPopDevList();
};

// 编辑
const handleEdit = (record: Record<string, any>) => {
  console.log("编辑", record);
  dialogForm.value?.editShow(record);
  showDialog.value = true;
};

// 详情
const handleDetails = (record: Record<string, any>) => {
  detailsContent.value = record;
  detailsShow.value = true;
};

// 搜索
const searchFn = (data: CommonPageData) => {
  pageData.value = data;
  getAllPopDevList();
};

// 配置POP设备
const handleSettings = (record: Record<string, any>) => {
  router.push({
    name: "ConfigPop",
    params: { name: record.name, id: record.id },
  });
};

// 重启设备
const handleReboot = async (record: Record<string, any>) => {
  const res = await reboot({ devId: record.id, devType: "pop" });
  if (res.data.code === 2000) getAllPopDevList();
};

// 关闭设备
const handleShutdown = async (record: Record<string, any>) => {
  const res = await shutdown({ devId: record.id, devType: "pop" });
  if (res.data.code === 2000) getAllPopDevList();
};
</script>

<template>
  <page-container :styleConfig="props.styleConfig">
    <CommonTools
      :topToolsConfig="topToolsConfig"
      :loading="gridOptions.loading"
      :pageData="pageData"
      :styleConfig="props.styleConfig"
      @searchFn="searchFn"
    />
    <CommonTable
      v-model="tableData"
      :gridOptions="gridOptions"
      :tableConfig="tableDataConfig"
      :pageData="pageData"
      :styleConfig="props.styleConfig"
      @handleTableChange="handleTableChange"
      @handleDeletes="handleDeletes"
      @handleDelete="handleDelete"
      @handleEdit="handleEdit"
      @handleAdd="handleAdd"
      @handleDetails="handleDetails"
      @handleSettings="handleSettings"
      @handleReboot="handleReboot"
      @handleShutdown="handleShutdown"
    />
    <!-- 新增/编辑弹窗 -->
    <AddDialog
      ref="dialogForm"
      v-model:show-dialog="showDialog"
      @refreshList="getAllPopDevList()"
    ></AddDialog>
    <!-- 详情抽屉 -->
    <CommonDetails
      v-model:detailsShow="detailsShow"
      :detailsContent="detailsContent"
      :title="'POP设备'"
    />
  </page-container>
</template>

<style scoped></style>
