<script setup lang="ts">
import { deleteBaseMenu, getBaseMenuList } from "@/api/system/menu";
import type { CommonPageData, MenuDataModel } from "@/types";
import { convertToFlat, dataTranfer } from "@/utils/recursion";
import { cloneDeep } from "lodash";
import AddDialog from "./components/add-menu.vue";
import { tableOption, tableDataConfig } from "./config/table.config";

interface DialogForm {
  editShow: (record: any) => void;
  addShow: (record: any) => void;
  // 其他属性和方法的类型声明
}

const treeData = ref<MenuDataModel[]>([]);
const showDialog = ref(false);
const dialogForm = ref<DialogForm | null>(null);
const gridOptions = ref<any>(tableOption);
const tableData = ref<any>([]);

const pageData = ref<CommonPageData>({
  page: 1,
  pageSize: 10,
  total: 0,
});

onMounted(() => {
  getAllBaseMenuList();
});

// 获取用户列表
const getAllBaseMenuList = async () => {
  try {
    gridOptions.value.loading = true;
    const res = await getBaseMenuList(pageData.value);
    const orginList_1 = cloneDeep(res.data.data.list);
    tableData.value = dataTranfer(orginList_1);
    tableData.value = convertToFlat(tableData.value);
    pageData.value.total = res.data.data.total;
    console.log("tableData", tableData.value);
    const orginList_2 = dataTranfer(res.data.data.list);
    const list = cloneDeep(orginList_2);
    treeData.value = [
      {
        id: 0,
        meta: { title: "顶级菜单" },
        title: "顶级菜单",
        name: "topMenu",
        children: list,
      },
    ];
    console.log("treeData", treeData.value);

    // 如果当前页面删除至没有数据(第一页除外)，则跳转到上一页
    pageData.value.total = res.data.data.total;
    if (
      pageData.value.page &&
      pageData.value.page > 1 &&
      res.data.data.list.length === 0
    ) {
      pageData.value.page = pageData.value.page - 1;
      getAllBaseMenuList();
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
  getAllBaseMenuList();
};

// 新增
const handleAdd = () => {
  showDialog.value = true;
};

// 新增子菜单
const handleAddson = (record: Record<string, any>) => {
  dialogForm.value?.addShow(record);
  showDialog.value = true;
};

// 删除
const handleDelete = async (record: Record<string, any>) => {
  const res = await deleteBaseMenu({ id: record.id });
  if (res.data.code === 2000) getAllBaseMenuList();
};

// 编辑
const handleEdit = (record: Record<string, any>) => {
  console.log("编辑", record);
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
      @handleTableChange="handleTableChange"
      @handleAddson="handleAddson"
      @handleDelete="handleDelete"
      @handleEdit="handleEdit"
      @handleAdd="handleAdd"
    />
    <!-- 新增/编辑弹窗 -->
    <AddDialog
      ref="dialogForm"
      v-model:show-dialog="showDialog"
      :treeData="treeData"
      @refreshList="getAllBaseMenuList()"
    ></AddDialog>
  </page-container>
</template>

<style scoped></style>
