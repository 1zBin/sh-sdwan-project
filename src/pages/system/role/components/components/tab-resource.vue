<script setup lang="ts">
import { getRoleList } from "@/api/system/role";

// 资源分配
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

const fieldNames = {
  children: "children",
  title: "authorityName",
  key: "authorityId",
};

// 角色资源初始化
onMounted(() => {
  getAllAresourceFn();
});

// 获取所有角色渲染树形结构
const getAllAresourceFn = async () => {
  const res = await getRoleList({
    page: 1,
    pageSize: 1000,
  });

  if (res.data.code === 2000) {
    formData.value.aresourceTreeData = res.data.data.list.map((v: any) => {
      v["id"] = v.authorityId;
      return v;
    });

    const findData = formData.value.aresourceTreeData.find(
      (value: any) => value.authorityId === props.authorityId
    );

    // 回显已勾选角色
    if (findData.dataAuthorityId && findData.dataAuthorityId.length) {
      formData.value.aresourceKeys = findData.dataAuthorityId.map(
        (val: any) => val.authorityId
      );
    } else {
      formData.value.aresourceKeys = [];
    }
  }
};

// 点击勾选函数
const aresourceFn = (_checked: any, checkedNodes: any) => {
  formData.value.dataAuthorityId = checkedNodes.checkedNodes;
};
</script>

<template>
  <a-tree
    v-if="formData.aresourceTreeData.length"
    @check="aresourceFn"
    v-model:checkedKeys="formData.aresourceKeys"
    checkable
    :checkStrictly="true"
    :defaultExpandAll="true"
    :fieldNames="fieldNames"
    :tree-data="formData.aresourceTreeData"
  ></a-tree>
</template>

<style scoped></style>
