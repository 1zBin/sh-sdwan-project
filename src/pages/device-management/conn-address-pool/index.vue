<script setup lang="ts">
import {
  getConnAddressPoolList,
  deleteConnAddressPool,
  deleteConnAddressPoolByIds,
} from "@/api/pop/popDev.ts";
import type { CommonPageData } from "@/types";
import AddDialog from "./components/add-address-pool.vue";
import { tableOption, tableDataConfig } from "./config/table.config";
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
  getAllConnAddressPoolList();
});

// 获取列表
const getAllConnAddressPoolList = async () => {
  try {
    gridOptions.value.loading = true;
    const res = await getConnAddressPoolList(pageData.value);
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
      getAllConnAddressPoolList();
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
  getAllConnAddressPoolList();
};

// 新增
const handleAdd = () => {
  showDialog.value = true;
};

// 删除
const handleDelete = async (record: Record<string, any>) => {
  const res = await deleteConnAddressPool({ id: record.id });
  if (res.data.code === 2000) getAllConnAddressPoolList();
};

// 批量删除
const handleDeletes = async (ids: number[]) => {
  const res = await deleteConnAddressPoolByIds({ ids: ids });
  if (res.data.code === 2000) getAllConnAddressPoolList();
};

// 编辑
const handleEdit = (record: Record<string, any>) => {
  console.log("编辑", record);
  dialogForm.value?.editShow(record);
  showDialog.value = true;
};
</script>

<template>
  <page-container :styleConfig="props.styleConfig">
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
    />
    <!-- 新增/编辑弹窗 -->
    <AddDialog
      ref="dialogForm"
      v-model:show-dialog="showDialog"
      @refreshList="getAllConnAddressPoolList()"
    ></AddDialog>
  </page-container>
</template>

<style scoped></style>
