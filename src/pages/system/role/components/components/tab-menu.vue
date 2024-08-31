<script setup lang="ts">
import {
  getAllBaseMenu,
  getAuthorityBtn,
  getMenuAuthority,
  setAuthorityBtn,
} from "@/api/system/permission";
import { cloneDeep } from "lodash-es";
import { convertToFlat } from "~@/utils/recursion";

const props = defineProps({
  // 自定义双向绑定传值
  modelValue: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  authorityId: {
    type: Number,
    required: true,
  },
});
const emits = defineEmits(["update:modelValue"]);

const formData = computed({
  get: () => props.modelValue,
  set: (val) => emits("update:modelValue", val),
});

const menuNames = {
  children: "children",
  title: "title",
  key: "id",
};
const visibleBtn = ref(false);
const menuBtndata = ref([]);
const menuId = ref<number>(0);
const selectedRowKeys = ref<number[]>([]);
// 按钮权限列表格式
const columns = [
  {
    title: "按钮名称",
    dataIndex: "name",
    key: "name",
    align: "left",
  },
  {
    title: "按钮备注",
    dataIndex: "desc",
    key: "desc",
    align: "left",
  },
];

onMounted(() => {
  getAllMenuList();
  getRoleMenus();
});

// 获取基础菜单树
const getAllMenuList = async () => {
  const res = await getAllBaseMenu();
  formData.value.menuTreeData = res.data.data.menus;
};

// 获取指定角色的菜单
const getRoleMenus = async () => {
  const res = await getMenuAuthority({ authorityId: props.authorityId });
  const menuIds = convertToFlat(res.data.data.menus).map(
    (item: any) => item.id
  );
  // 回显改角色所拥有的菜单在树形结构上勾选上
  formData.value["menuCheckedKeys"] = cloneDeep(menuIds);
  formData.value["menus"] = res.data.data.menus;
};

// change事件
const menucheckFn = (checked: any, event: any) => {
  console.log("checked", checked, event.checkedNodes, formData.value);
  formData.value["menus"] = event.checkedNodes;
};

// 按钮权限分配部分
const allotBtn = async (data: any) => {
  visibleBtn.value = true;
  const res = await getAuthorityBtn({
    authorityId: props.authorityId,
    menuId: data.id,
  });
  if (res.data.code === 2000) {
    selectedRowKeys.value = res.data.data.buttonIds;
  }
  menuBtndata.value = data.menuBtn;
  menuId.value = data.id;
};

// 按钮权限多选框
const onSelectChange = (rowKeys: any) => {
  selectedRowKeys.value = [];
  selectedRowKeys.value = rowKeys;
};

// 按钮权限提交
const handleBtnOk = async () => {
  const res = await setAuthorityBtn({
    authorityId: props.authorityId,
    menuId: menuId.value,
    buttonIds: selectedRowKeys.value,
  });
  if (res.data.code === 2000) {
    visibleBtn.value = false;
  }
};
</script>

<template>
  <a-tree
    v-if="formData.menuTreeData && formData.menuTreeData.length"
    @check="menucheckFn"
    v-model:checkedKeys="formData.menuCheckedKeys"
    :fieldNames="menuNames"
    checkable
    :checkStrictly="true"
    :defaultExpandAll="true"
    :tree-data="formData.menuTreeData"
  >
    <template #title="{ data }">
      <span>{{ data.meta.title }}</span>
      <a
        v-if="data.menuBtn.length"
        style="font-size: 12px; margin-left: 5px"
        @click="allotBtn(data)"
      >
        分配按钮</a
      >
    </template>
  </a-tree>

  <a-modal
    :zIndex="1010"
    v-model:open="visibleBtn"
    title="分配按钮"
    @ok="handleBtnOk"
  >
    <a-table
      rowKey="id"
      :columns="(columns as any)"
      :data-source="menuBtndata"
      :pagination="{ hideOnSinglePage: true }"
      :locale="{ emptyText: '暂无数据' }"
      style="width: 100%"
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
      }"
    ></a-table>
  </a-modal>
</template>

<style scoped></style>
