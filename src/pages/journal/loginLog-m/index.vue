<script setup lang="ts">
import { getUserLoginLogAllList } from "@/api/journal/loginLog";
import type { CommonPageData } from "@/types";
import { tableOption, tableDataConfig } from "./config/table.config";
import { topToolsConfig } from "./config/tools.config";

const gridOptions = ref<any>(tableOption);
const tableData = ref([]);

const pageData = ref<CommonPageData>({
  page: 1,
  pageSize: 10,
  total: 0,
});

onMounted(() => {
  getAllUserLoginLogAllList();
});

// 获取所有用户的登录日志
const getAllUserLoginLogAllList = async () => {
  try {
    tableData.value = [];
    gridOptions.value.loading = true;
    const res = await getUserLoginLogAllList(pageData.value);
    tableData.value = res.data.data.list;
    pageData.value.total = res.data.data.total;
    console.log("AllLoginList", tableData.value);

    if (
      pageData.value.page &&
      pageData.value.page > 1 &&
      res.data.data.list.length === 0
    ) {
      pageData.value.page = pageData.value.page - 1;
      getAllUserLoginLogAllList();
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
  getAllUserLoginLogAllList();
};

// 搜索
const searchFn = (data: CommonPageData) => {
  pageData.value = data;
  getAllUserLoginLogAllList();
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
    />
  </page-container>
</template>

<style scoped></style>
