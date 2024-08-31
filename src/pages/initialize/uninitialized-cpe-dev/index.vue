<script setup lang="ts">
import { getUninitializedCpeDevList } from "@/api/initialize/uninitializedCpeDev.ts";
import type { CommonPageData } from "@/types";
import { tableOption, tableDataConfig } from "./config/table.config";
import AddCpeDev from "./components/add-cpe-dev.vue";

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

const showDialog = ref(false);
const dialogForm = ref<DialogForm | null>(null);
const gridOptions = ref<any>(tableOption);
const tableData = ref([]);

const pageData = ref<CommonPageData>({
  page: 1,
  pageSize: 10,
  total: 0,
});

onMounted(() => {
  getAllUninitializedCpeDevList();
});

// 获取列表
const getAllUninitializedCpeDevList = async () => {
  try {
    gridOptions.value.loading = true;
    const res = await getUninitializedCpeDevList(pageData.value);
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
      getAllUninitializedCpeDevList();
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
  getAllUninitializedCpeDevList();
};

// 新增
const handleAddCpe = (record: Record<string, object>) => {
  dialogForm.value?.editShow(record);
  showDialog.value = true;
};
</script>

<template>
  <page-container>
    <CommonTable
      v-model="tableData"
      :gridOptions="gridOptions"
      :tableConfig="tableDataConfig"
      :pageData="pageData"
      :styleConfig="props.styleConfig"
      @handleTableChange="handleTableChange"
      @handleAddCpe="handleAddCpe"
    />
    <!-- 新增/编辑弹窗 -->
    <AddCpeDev
      ref="dialogForm"
      v-model:show-dialog="showDialog"
      @refreshList="getAllUninitializedCpeDevList()"
    ></AddCpeDev>
  </page-container>
</template>

<style scoped></style>
~@/api/initialize/uninitializedCpeDev
