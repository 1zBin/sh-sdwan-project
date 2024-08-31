<script setup lang="ts">
import {
  deleteSysOperationRecord,
  deleteSysOperationRecordByIds,
  getSysOperationRecordList,
} from "@/api/system/operation-record";
import type { CommonPageData } from "@/types";
import { tableOption, tableDataConfig } from "./config/table.config";
import { topToolsConfig } from "./config/tools.config";
import { setTableOption } from "~@/utils/tableConfig";

const gridOptions = ref<any>(setTableOption(tableOption, "checkbox"));
const tableData = ref([]);

const pageData = ref<CommonPageData>({
  page: 1,
  pageSize: 10,
  total: 0,
});

onMounted(() => {
  getAllSysOperationRecordList();
});

// 获取用户列表
const getAllSysOperationRecordList = async () => {
  try {
    gridOptions.value.loading = true;
    const res = await getSysOperationRecordList(pageData.value);
    const reg = /[,]/g;
    tableData.value = res.data.data.list.map((val: Record<string, any>) => {
      val.reqBody = val.reqBody.toString();
      val.respBody = val.respBody.toString();
      val.reqBody = val.reqBody.replace(reg, ",<br>");
      val.respBody = val.respBody.replace(reg, ",<br>");
      return val;
    });
    console.log("tableData", tableData.value);
    pageData.value.total = res.data.data.total;
    if (
      pageData.value.page &&
      pageData.value.page > 1 &&
      res.data.data.list.length === 0
    ) {
      pageData.value.page = pageData.value.page - 1;
      getAllSysOperationRecordList();
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
  getAllSysOperationRecordList();
};

// 删除
const handleDelete = async (record: Record<string, any>) => {
  const res = await deleteSysOperationRecord({ id: record.id });
  if (res.data.code === 2000) getAllSysOperationRecordList();
};

// 批量删除
const handleDeletes = async (ids: number[]) => {
  const res = await deleteSysOperationRecordByIds({ ids: ids });
  if (res.data.code === 2000) getAllSysOperationRecordList();
};

// 搜索
const searchFn = (data: CommonPageData) => {
  pageData.value = data;
  getAllSysOperationRecordList();
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
    />
  </page-container>
</template>

<style scoped></style>
