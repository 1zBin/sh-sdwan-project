<script setup lang="ts">
import { getAllApis } from "@/api/system/api";
import { getRoleAuthorityById } from "@/api/system/permission";
import { cloneDeep } from "lodash-es";

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

const apiNames = reactive({
  children: "children",
  title: "description",
  key: "path",
});

onMounted(() => {
  getAllApiList();
  getRoleApi();
});

// 获取所有Api并改造成树形结构
const getAllApiList = async () => {
  const data = await getAllApis();
  formData.value.apiTreeData = Object.values(
    data.data.data.apis.reduce((acc: any, cur: any) => {
      if (!acc[cur.apiGroup]) {
        acc[cur.apiGroup] = {
          description: cur.apiGroup,
          children: [cur],
          path: `parent_${cur.id}`,
        };
      } else {
        acc[cur.apiGroup].children.push(cur);
      }
      return acc;
    }, {})
  );
};

// 获取该角色已关联的api并在树形结构上勾选上
const getRoleApi = async () => {
  const res = await getRoleAuthorityById({ authorityId: props.authorityId });
  const apiPaths = res.data.data.paths.map((item: any) => item.path);
  // 回显改角色所拥有的菜单在树形结构上勾选上
  formData.value["apiCheckedKeys"] = cloneDeep(apiPaths);
  formData.value["casbinInfos"] = res.data.data.paths;
};

// 点击勾选复选框的回调函数
const apicheckFn = (_checked: any, event: any) => {
  formData.value["casbinInfos"] = event.checkedNodes.filter(
    (v: any) => !v.path.includes("parent_")
  );
};
</script>

<template>
  <a-tree
    v-if="formData.apiTreeData.length"
    @check="apicheckFn"
    v-model:checkedKeys="formData.apiCheckedKeys"
    :fieldNames="apiNames"
    checkable
    :defaultExpandAll="true"
    :selectable="false"
    :tree-data="formData.apiTreeData"
  >
  </a-tree>
</template>

<style scoped></style>
