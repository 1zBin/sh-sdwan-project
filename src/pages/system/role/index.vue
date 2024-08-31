<script setup lang="ts">
import { deleteRole, getRoleList } from "@/api/system/role";
import type { CommonPageData } from "@/types";
import AddDialog from "./components/add-role.vue";
import SetPermission from "./components/set-permission.vue";
import { tableOption, tableDataConfig } from "./config/table.config";
import { convertToFlat } from "~@/utils/recursion";

interface DialogForm {
  addSonShow: (record: Record<string, any>) => void;
  editShow: (record: Record<string, any>) => void;
  copyShow: (record: Record<string, any>) => void;
  // 其他属性和方法的类型声明
}

const showDialog = ref(false);
const permissionShow = ref(false);
const authorityId = ref(0);
const dialogForm = ref<DialogForm | null>(null);
const gridOptions = ref<any>(tableOption);
const tableData = ref<any>([]);

const pageData = ref<CommonPageData>({
  page: 1,
  pageSize: 10,
  total: 0,
});

onMounted(() => {
  getAllRoleList();
});

// 获取列表
const getAllRoleList = async () => {
  try {
    gridOptions.value.loading = true;
    const res = await getRoleList(pageData.value);
    tableData.value = dataTranfer(res.data.data.list);
    tableData.value = convertToFlat(tableData.value);
    pageData.value.total = res.data.data.total;
    console.log("tableData", tableData.value);

    // 如果当前页面删除至没有数据(第一页除外)，则跳转到上一页
    if (
      pageData.value.page &&
      pageData.value.page > 1 &&
      res.data.data.list.length === 0
    ) {
      pageData.value.page = pageData.value.page - 1;
      getAllRoleList();
    }
    gridOptions.value.loading = false;
  } catch (error) {
    gridOptions.value.loading = false;
  }
};

const dataTranfer = (list: Record<string, any>[], parentName = "根角色") => {
  return list.map((item) => {
    const newItem = { ...item };
    newItem.id = newItem.authorityId;
    newItem.parentName = parentName;
    if (newItem.children && newItem.children.length > 0) {
      newItem.children = dataTranfer(newItem.children, newItem.authorityName);
    }
    return newItem;
  });
};

// 分页跳转函数
const handleTableChange = (currentPage: number, pageSize: number) => {
  pageData.value.page = currentPage;
  pageData.value.pageSize = pageSize;
  getAllRoleList();
};

// 新增
const handleAdd = () => {
  showDialog.value = true;
};

// 删除
const handleDelete = async (record: Record<string, any>) => {
  const res = await deleteRole({ authorityId: record.authorityId });
  if (res.data.code === 2000) getAllRoleList();
};

// 添加子角色
const handleAddson = (record: Record<string, any>) => {
  showDialog.value = true;
  dialogForm.value?.addSonShow(record);
};

// 编辑
const handleEdit = (record: Record<string, any>) => {
  console.log("编辑", record);
  dialogForm.value?.editShow(record);
  showDialog.value = true;
};

// 设置权限
const handlePermission = (record: Record<string, any>) => {
  authorityId.value = record.authorityId;
  permissionShow.value = true;
};

// 拷贝角色
const handleCopy = (record: Record<string, any>) => {
  dialogForm.value?.copyShow(record);
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
      @handleDelete="handleDelete"
      @handleEdit="handleEdit"
      @handleAdd="handleAdd"
      @handlePermission="handlePermission"
      @handleCopy="handleCopy"
      @handleAddson="handleAddson"
    />
    <!-- 新增/编辑弹窗 -->
    <AddDialog
      ref="dialogForm"
      v-model:show-dialog="showDialog"
      @refreshList="getAllRoleList()"
    ></AddDialog>

    <!-- 权限设置 -->
    <SetPermission
      v-model:permission-show="permissionShow"
      :authorityId="authorityId"
    />
  </page-container>
</template>

<style scoped></style>
