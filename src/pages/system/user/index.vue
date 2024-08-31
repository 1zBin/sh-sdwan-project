<script setup lang="ts">
import { getRoleList } from "@/api/system/role";
import {
  deleteUser,
  getUserList,
  modifyUserInfoFromAdmin,
  resetPassword,
} from "@/api/system/user";
import type { CommonPageData } from "@/types";
import AddDialog from "./components/add-user.vue";
import { tableOption, tableDataConfig } from "./config/table.config";
import { topToolsConfig } from "./config/tools.config";

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

const roleList = ref([]); // 角色列表
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
  getAllUserList();
  getAllRoleList();
});

// 获取列表
const getAllUserList = async () => {
  try {
    gridOptions.value.loading = true;
    const res = await getUserList(pageData.value);
    tableData.value = res.data.data.list;
    pageData.value.total = res.data.data.total;
    console.log("userList", res.data.data.list);

    // 如果当前页面删除至没有数据(第一页除外)，则跳转到上一页
    if (
      pageData.value.page &&
      pageData.value.page > 1 &&
      res.data.data.list.length === 0
    ) {
      pageData.value.page = pageData.value.page - 1;
      getAllUserList();
    }
    gridOptions.value.loading = false;
  } catch (error) {
    gridOptions.value.loading = false;
  }
};

// 获取角色列表
const getAllRoleList = async () => {
  try {
    const res = await getRoleList({ page: 1, pageSize: 1000 });
    roleList.value = res.data.data.list.map((val: Record<string, object>) => {
      val["value"] = val.authorityId;
      return val;
    });
  } catch (error) {
    return;
  }
};

// 分页跳转函数
const handleTableChange = (currentPage: number, pageSize: number) => {
  pageData.value.page = currentPage;
  pageData.value.pageSize = pageSize;
  getAllUserList();
};

// 新增
const handleAdd = () => {
  showDialog.value = true;
};

// 删除
const handleDelete = async (record: Record<string, any>) => {
  const res = await deleteUser({ id: record.id });
  if (res.data.code === 2000) getAllUserList();
};

// 编辑
const handleEdit = (record: Record<string, any>) => {
  dialogForm.value?.editShow(record);
  showDialog.value = true;
};

// 重置密码
const handleReset = async (record: Record<string, any>) => {
  await resetPassword({ id: record.id });
};

// 修改用户状态
const changeSwitchFn = async (record: Record<string, any>) => {
  await modifyUserInfoFromAdmin(record);
};

// 搜索
const searchFn = (data: CommonPageData) => {
  pageData.value = data;
  getAllUserList();
};
</script>

<template>
  <page-container>
    <CommonTools
      :topToolsConfig="topToolsConfig"
      :loading="gridOptions.loading"
      :pageData="pageData"
      :styleConfig="props.styleConfig"
      @searchFn="searchFn"
    />
    <CommonTable
      v-model="tableData"
      :gridOptions="gridOptions"
      :tableConfig="tableDataConfig"
      :pageData="pageData"
      @handleTableChange="handleTableChange"
      @handleDelete="handleDelete"
      @handleEdit="handleEdit"
      @handleAdd="handleAdd"
      @handleReset="handleReset"
      @changeSwitchFn="changeSwitchFn"
    />
    <!-- 新增/编辑弹窗 -->
    <AddDialog
      ref="dialogForm"
      v-model:show-dialog="showDialog"
      :roleList="roleList"
      @refreshList="getAllUserList()"
    ></AddDialog>
  </page-container>
</template>

<style scoped></style>
