<script setup lang="ts">
import { getIpRouteList, removeIpRoute } from "@/api/device/ipRoute.ts";
import AddDialog from "./components/add-route.vue";
import { tableOption, tableDataConfig } from "./config/table.config";
import { CommonPageData } from "~@/types";
import { setTableOption } from "~@/utils/tableConfig";

const props = defineProps({
  cpeId: {
    type: Number,
    required: true,
  },
  configBelong: {
    type: String,
    required: true,
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
  configBelong: props.configBelong,
  cpeDevID: props.cpeId,
});

onMounted(() => {
  getAllIpRouteList();
});

// 获取列表
const getAllIpRouteList = async () => {
  try {
    tableData.value = [];
    gridOptions.value.loading = true;
    const res = await getIpRouteList(pageData.value);
    tableData.value = res.data.data.list;
    console.log("IpRouteList", tableData.value);
    pageData.value.total = res.data.data.total;
    // 如果当前页面删除至没有数据(第一页除外)，则跳转到上一页
    if (
      pageData.value.page &&
      pageData.value.page > 1 &&
      tableData.value.length === 0
    ) {
      pageData.value.page = pageData.value.page - 1;
      getAllIpRouteList();
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
  getAllIpRouteList();
};

// 新增
const handleAdd = () => {
  showDialog.value = true;
};

// 删除
const handleDelete = async (record: Record<string, any>) => {
  const res = await removeIpRoute({
    ids: [record.id],
    cpeDevID: props.cpeId,
  });
  if (res.data.code === 2000) getAllIpRouteList();
};

// 批量删除
const handleDeletes = async (ids: number[]) => {
  const res = await removeIpRoute({ ids: ids, cpeDevID: props.cpeId });
  if (res.data.code === 2000) getAllIpRouteList();
};

// 编辑
const handleEdit = (record: Record<string, any>) => {
  console.log("编辑", record);
  dialogForm.value?.editShow(record);
  showDialog.value = true;
};
</script>

<template>
  <CommonTable
    v-model="tableData"
    :gridOptions="gridOptions"
    :tableConfig="tableDataConfig"
    :pageData="pageData"
    @handleTableChange="handleTableChange"
    @handleDelete="handleDelete"
    @handleDeletes="handleDeletes"
    @handleEdit="handleEdit"
    @handleAdd="handleAdd"
  />
  <!-- 新增/编辑弹窗 -->
  <AddDialog
    ref="dialogForm"
    v-model:show-dialog="showDialog"
    :cpeId="props.cpeId"
    :configBelong="props.configBelong"
    @refreshList="getAllIpRouteList()"
  ></AddDialog>
</template>

<style scoped></style>
