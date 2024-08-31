<script setup lang="ts">
import { deleteApi, deleteApiByIds, getApiList } from "@/api/system/api";
import type { CommonPageData } from "@/types";
import AddDialog from "./components/add-api.vue";
import { tableOption, tableDataConfig } from "./config/table.config";
import { topToolsConfig } from "./config/tools.config";
import { setTableOption } from "~@/utils/tableConfig";

interface DialogForm {
  editShow: (record: any) => void;
  // 其他属性和方法的类型声明
}

const showDialog = ref(false);
const dialogForm = ref<DialogForm | null>(null);
const gridOptions = ref<any>(setTableOption(tableOption, "checkbox"));
const tableData = ref([]);

const pageData = ref<CommonPageData>({
  page: 1,
  pageSize: 10,
  total: 0,
});

onMounted(() => {
  getAllApiList();
});

// 获取列表
const getAllApiList = async () => {
  try {
    gridOptions.value.loading = true;
    const res = await getApiList(pageData.value);
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
      getAllApiList();
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
  getAllApiList();
};

// 新增
const handleAdd = () => {
  showDialog.value = true;
};

// 删除
const handleDelete = async (record: Record<string, any>) => {
  const res = await deleteApi({ id: record.id });
  if (res.data.code === 2000) getAllApiList();
};

// 批量删除
const handleDeletes = async (ids: number[]) => {
  const res = await deleteApiByIds({ ids: ids });
  if (res.data.code === 2000) getAllApiList();
};

// 编辑
const handleEdit = (record: Record<string, any>) => {
  console.log("编辑", record);
  dialogForm.value?.editShow(record);
  showDialog.value = true;
};

// 搜索
const searchFn = (data: CommonPageData) => {
  pageData.value = data;
  getAllApiList();
};
</script>

<template>
  <page-container>
    <CommonTools
      :topToolsConfig="topToolsConfig"
      :loading="gridOptions.loading"
      :pageData="pageData"
      @searchFn="searchFn"
    />
    <CommonTable
      v-model="tableData"
      :gridOptions="gridOptions"
      :tableConfig="tableDataConfig"
      :pageData="pageData"
      @handleTableChange="handleTableChange"
      @handleDeletes="handleDeletes"
      @handleDelete="handleDelete"
      @handleEdit="handleEdit"
      @handleAdd="handleAdd"
    />
    <!-- 新增/编辑弹窗 -->
    <AddDialog
      ref="dialogForm"
      v-model:show-dialog="showDialog"
      @refreshList="getAllApiList()"
    ></AddDialog>
  </page-container>
</template>

<style scoped></style>
