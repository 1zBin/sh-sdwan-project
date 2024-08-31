<script setup lang="ts">
import {
  addMenuAuthority,
  updateRoleAuthorityById,
} from "@/api/system/permission";
import { setRoleAssociation } from "@/api/system/role";
import { cloneDeep } from "lodash-es";
import { convertToFlat } from "~@/utils/recursion";
// Component
import TabApi from "./components/tab-api.vue";
import TabMenu from "./components/tab-menu.vue";
import TabResource from "./components/tab-resource.vue";

const props = defineProps({
  permissionShow: {
    type: Boolean,
    default: false,
  },
  authorityId: {
    type: Number,
    required: true,
  },
});

const emits = defineEmits(["update:permissionShow"]);

const isVisibleShow = computed({
  get: () => props.permissionShow,
  set: (val) => emits("update:permissionShow", val),
});

const activeKey = ref<string | number>("1");
const permissionData = ref<any>({
  menuData: {
    authorityId: 0,
    menus: [],
    menuTreeData: [],
    menuCheckedKeys: [],
  },
  apiData: {
    authorityId: 0,
    casbinInfos: [],
    apiTreeData: [],
    apiCheckedKeys: [],
  },
  resourceData: {
    authorityId: 0,
    dataAuthorityId: [],
    aresourceTreeData: [],
    aresourceKeys: [],
  },
});

// 切换tabs时回显内容
const changeTabs = async (num: string | number) => {
  activeKey.value = num;
};

// 切换全选或反选
const changeSelected = async () => {
  if (activeKey.value === "1") {
    if (permissionData.value.menuData.menuCheckedKeys.length === 0) {
      const allMenu = cloneDeep(permissionData.value.menuData.menuTreeData);
      const newData = convertToFlat(allMenu);
      permissionData.value.menuData.menus = newData;
      permissionData.value.menuData.menuCheckedKeys = newData.map(
        (v: any) => v.id
      );
    } else {
      permissionData.value.menuData.menuCheckedKeys = [];
      permissionData.value.menuData.menus = [];
    }
  } else if (activeKey.value === "2") {
    if (permissionData.value.apiData.apiCheckedKeys.length === 0) {
      const allApi = cloneDeep(permissionData.value.apiData.apiTreeData);
      const newData = convertToFlat(allApi);
      permissionData.value.apiData.casbinInfos = newData.filter(
        (e: any) => !e.path.includes("parent_")
      );
      permissionData.value.apiData.apiCheckedKeys = newData.map(
        (v: any) => v.path
      );
    } else {
      permissionData.value.apiData.apiCheckedKeys = [];
      permissionData.value.apiData.casbinInfos = [];
    }
  } else if (activeKey.value === "3") {
    if (permissionData.value.resourceData.aresourceKeys.length === 0) {
      const allAresource = cloneDeep(
        permissionData.value.resourceData.aresourceTreeData
      );
      const newData = convertToFlat(allAresource);
      permissionData.value.resourceData.dataAuthorityId = newData;
      permissionData.value.resourceData.aresourceKeys = newData.map(
        (v: any) => v.authorityId
      );
    } else {
      permissionData.value.resourceData.aresourceKeys = [];
      permissionData.value.resourceData.dataAuthorityId = [];
    }
  }
};

// 提交数据
const submitFn = async () => {
  if (activeKey.value === "1") {
    permissionData.value.menuData.authorityId = props.authorityId;
    const data = cloneDeep(permissionData.value.menuData);
    delete data.menuTreeData;
    delete data.menuCheckedKeys;
    const res = await addMenuAuthority(data);
    if (res.data.code === 2000) {
      onClose();
      window.location.reload();
    }
    console.log("提交菜单权限数据", data);
  } else if (activeKey.value === "2") {
    permissionData.value.apiData.authorityId = props.authorityId;
    const data = cloneDeep(permissionData.value.apiData);
    delete data.apiTreeData;
    delete data.apiCheckedKeys;
    const res = await updateRoleAuthorityById(data);
    if (res.data.code === 2000) {
      onClose();
      window.location.reload();
    }
    console.log("提交Api权限数据", data);
  } else if (activeKey.value === "3") {
    permissionData.value.resourceData.authorityId = props.authorityId;
    const data = cloneDeep(permissionData.value.resourceData);
    delete data.aresourceTreeData;
    delete data.aresourceKeys;
    const res = await setRoleAssociation(data);
    if (res.data.code === 2000) {
      onClose();
      window.location.reload();
    }
    console.log("提交资源分配数据", data);
  }
};

// 关闭抽屉
const onClose = () => {
  activeKey.value = "1";
  isVisibleShow.value = false;
};
</script>

<template>
  <!-- 权限分配 -->
  <a-drawer
    width="400"
    v-model:open="isVisibleShow"
    placement="right"
    :closable="false"
    :destroyOnClose="true"
    @close="onClose"
  >
    <div>
      <a-tabs centered v-model:activeKey="activeKey" @change="changeTabs">
        <a-tab-pane key="1" tab="菜单权限">
          <TabMenu
            v-model="permissionData.menuData"
            :authorityId="authorityId"
          ></TabMenu>
        </a-tab-pane>
        <a-tab-pane key="2" tab="Api权限" force-render>
          <TabApi
            v-model="permissionData.apiData"
            :authorityId="authorityId"
          ></TabApi>
        </a-tab-pane>
        <a-tab-pane key="3" tab="角色分配">
          <TabResource
            v-model="permissionData.resourceData"
            :authorityId="authorityId"
          ></TabResource>
        </a-tab-pane>
      </a-tabs>
      <CloseOutlined class="closeIcon" @click="onClose()" />
    </div>

    <template #footer>
      <div flex justify-end>
        <template v-if="activeKey === '1'">
          <a-button mr-2 @click="changeSelected">{{
            permissionData.menuData.menuCheckedKeys.length === 0
              ? "全选"
              : "清空"
          }}</a-button>
        </template>
        <template v-else-if="activeKey === '2'">
          <a-button mr-2 @click="changeSelected">{{
            permissionData.apiData.apiCheckedKeys.length === 0 ? "全选" : "清空"
          }}</a-button>
        </template>
        <template v-else-if="activeKey === '3'">
          <a-button mr-2 @click="changeSelected">{{
            permissionData.resourceData.aresourceKeys.length === 0
              ? "全选"
              : "清空"
          }}</a-button>
        </template>
        <a-button type="primary" @click="submitFn">提交</a-button>
      </div>
    </template>
  </a-drawer>
</template>

<style scoped>
:deep(.ant-drawer-body) {
  position: relative;
}
.closeIcon {
  position: absolute;
  top: 15px;
  right: 15px;
  color: #8c8c8c;
  font-size: 16px;
  &:hover {
    color: #1f1f1f;
    transition: all 0.3s;
    cursor: pointer;
  }
}
</style>
