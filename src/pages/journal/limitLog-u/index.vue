<script setup lang="ts">
import { getUserLoginLimitLogSelfList } from "@/api/journal/limitLog";
import type { CommonPageData } from "@/types";
import { tableOption, tableDataConfig } from "./config/table.config";
import { topToolsConfig } from "./config/tools.config";

const gridOptions = ref<any>(tableOption);
const tableData = ref([]);

const pageData = ref<CommonPageData>({
  page: 1,
  pageSize: 10,
});

onMounted(() => {
  getAllUserLoginLimitLogSelfList();
});

// 获取当前用户的封禁日志
const getAllUserLoginLimitLogSelfList = async () => {
  try {
    tableData.value = [];
    gridOptions.value.loading = true;
    const res = await getUserLoginLimitLogSelfList(pageData.value);
    tableData.value = res.data.data.list;
    console.log("SelfList", tableData.value);
    pageData.value.total = res.data.data.total;
    if (
      pageData.value.page &&
      pageData.value.page > 1 &&
      res.data.data.list.length === 0
    ) {
      pageData.value.page = pageData.value.page - 1;
      getAllUserLoginLimitLogSelfList();
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
  getAllUserLoginLimitLogSelfList();
};

// 搜索
const searchFn = (data: CommonPageData) => {
  pageData.value = data;
  getAllUserLoginLimitLogSelfList();
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
