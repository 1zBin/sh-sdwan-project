<script setup lang="ts">
import {
  deleteInitDhcp,
  deleteInitDhcpByIds,
  getInitDhcpList,
} from "@/api/initialize/initDhcp.ts";
import type { CommonPageData } from "@/types";
import AddDialog from "./components/add-init-dhcp.vue";
import { tableOption, tableDataConfig } from "./config/table.config";
import { setTableOption } from "~@/utils/tableConfig";
import { topToolsConfig } from "./config/tools.config";

interface DialogForm {
  editShow: (record: any) => void;
  // 其他属性和方法的类型声明
}

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
  getAllInitDhcpList();
});

// 获取列表
const getAllInitDhcpList = async () => {
  try {
    gridOptions.value.loading = true;
    const res = await getInitDhcpList(pageData.value);
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
      getAllInitDhcpList();
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
  getAllInitDhcpList();
};

// 新增
const handleAdd = () => {
  showDialog.value = true;
};

// 删除
const handleDelete = async (record: Record<string, any>) => {
  const res = await deleteInitDhcp({ id: record.id });
  if (res.data.code === 2000) getAllInitDhcpList();
};

// 批量删除
const handleDeletes = async (ids: number[]) => {
  const res = await deleteInitDhcpByIds({ ids: ids });
  if (res.data.code === 2000) getAllInitDhcpList();
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
  getAllInitDhcpList();
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
      @handleDetails="handleDetails"
    />
    <!-- 新增/编辑弹窗 -->
    <AddDialog
      ref="dialogForm"
      v-model:show-dialog="showDialog"
      @refreshList="getAllInitDhcpList()"
    ></AddDialog>
    <!-- 详情抽屉 -->
    <CommonDetails
      v-model:detailsShow="detailsShow"
      :detailsContent="detailsContent"
      :title="'初始化DHCP'"
    />
  </page-container>
</template>

<style scoped></style>
~@/api/initialize/initDhcp
