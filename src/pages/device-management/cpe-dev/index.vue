<script setup lang="ts">
import { deleteCpeDev, getCpeDevList } from "@/api/cpe/cpeDev.ts";
import { dwonloadCrt } from "@/api/device/crt.ts";
import { reboot, shutdown } from "@/api/device/devReboot.ts";
import type { CommonPageData } from "@/types";
import AddDialog from "./components/add-cpe-dev.vue";
import ResetDev from "./components/reset-dev.vue";
import { tableOption, tableDataConfig } from "./config/table.config";
import { topToolsConfig } from "./config/tools.config";
import { useRouter } from "vue-router";
import { downloadFile } from "@/utils/downloadFile";

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
const resetDevRef = ref<DialogForm | null>(null);
const gridOptions = ref<any>(tableOption);
const tableData = ref([]);
const detailsShow = ref(false);
const detailsContent = ref({});

const pageData = ref<CommonPageData>({
  page: 1,
  pageSize: 10,
  total: 0,
});

onMounted(() => {
  getAllCpeDev();
});

// 获取列表
const getAllCpeDev = async () => {
  try {
    gridOptions.value.loading = true;
    const res = await getCpeDevList(pageData.value);
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
      getAllCpeDev();
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
  getAllCpeDev();
};

// 新增
const handleAdd = () => {
  showDialog.value = true;
};

// 删除
const handleDelete = async (record: Record<string, any>) => {
  const res = await deleteCpeDev({ id: record.id });
  if (res.data.code === 2000) getAllCpeDev();
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
  getAllCpeDev();
};

// 配置CPE设备
const handleSettings = (record: Record<string, any>) => {
  router.push({
    name: "ConfigCpe",
    params: { name: record.name, id: record.id },
  });
};

// 下载CPE证书
const handleDwonloadCrt = async (num: number) => {
  try {
    const res = (await dwonloadCrt({ crtType: num })) as any;
    const fileName = res.headers["content-disposition"]
      .split("filename=")[1]
      .split(".")[0];
    const contentType = res.headers["content-type"];
    downloadFile(res, fileName, "tar.xz", contentType);
  } catch (error) {
    console.log(error);
  }
};

// 重启设备
const handleReboot = async (record: Record<string, any>) => {
  const res = await reboot({ devId: record.id, devType: "cpe" });
  if (res.data.code === 2000) getAllCpeDev();
};

// 重置设备
const radioTableShow = ref(false);
const handleReset = async (record: Record<string, any>) => {
  resetDevRef.value?.editShow(record);
  radioTableShow.value = true;
};

// 关闭设备
const handleShutdown = async (record: Record<string, any>) => {
  const res = await shutdown({ devId: record.id, devType: "cpe" });
  if (res.data.code === 2000) getAllCpeDev();
};
</script>

<template>
  <page-container>
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
      @handleDelete="handleDelete"
      @handleEdit="handleEdit"
      @handleAdd="handleAdd"
      @handleDetails="handleDetails"
      @handleSettings="handleSettings"
      @handleDwonloadCrt="handleDwonloadCrt"
      @handleReboot="handleReboot"
      @handleReset="handleReset"
      @handleShutdown="handleShutdown"
    />
    <!-- 新增/编辑弹窗 -->
    <AddDialog
      ref="dialogForm"
      v-model:show-dialog="showDialog"
      @refreshList="getAllCpeDev()"
    ></AddDialog>
    <!-- 详情抽屉 -->
    <CommonDetails
      v-model:detailsShow="detailsShow"
      :detailsContent="detailsContent"
      :title="'CPE设备'"
    />

    <ResetDev
      ref="resetDevRef"
      v-model:radioTableShow="radioTableShow"
      @refreshList="getAllCpeDev()"
    />
  </page-container>
</template>

<style scoped></style>
