<script setup lang="ts">
import errorUserAvatar from "@/assets/images/errorUserAvatar.png";
import { changeUserRole } from "@/api/system/user";
import { useLogout, useUserStore, useMultiTab } from "@/stores";
import { Modal } from "ant-design-vue";
import { RouterLink } from "vue-router";
import { showFile } from "@/api/file/upload";
import emitter from "~@/utils/eventbus";

const isShowDialog = ref(false);
const confirmLoading = ref(false);
const roleList = ref<any>([]);
const roleValue = ref();
const { userInfo, removeUserInfo, getUserInfo, setUserInfo } = useUserStore();
const avatar = ref("");
const nickName = ref(userInfo.nickName);

const { logoutFn } = useLogout();
const { clearAllTab } = useMultiTab();
const logout = () => {
  Modal.confirm({
    title: "温馨提示",
    content: "你确认退出SDWan管理系统吗?",
    okText: "确认",
    cancelText: "取消",
    onOk() {
      logoutFn();
      clearAllTab();
    },
  });
};

onMounted(async () => {
  if (userInfo.headerImg) {
    const res = await showFile(userInfo.headerImg);
    avatar.value = URL.createObjectURL(res.request.response);
  }
});

const changeUserAvatar = async (info: any) => {
  if (info.headerImg) {
    const res = await showFile(info.headerImg);
    avatar.value = URL.createObjectURL(res.request.response);
  } else {
    avatar.value = errorUserAvatar;
  }
  nickName.value = info.nickName;
};
emitter.on("changeUserAvatar", changeUserAvatar);
// 图片加载错误则用本地图片
const loadErrorFn = () => {
  avatar.value = errorUserAvatar;
};

// 切换角色
const changeRoleFn = async () => {
  const result = await getUserInfo();
  if (result.data.code === 2000) {
    const authorities = result.data.data.userInfo.authorities;
    if (authorities && authorities.length) {
      roleList.value = authorities;
      roleValue.value = result.data.data.userInfo.authorityId;
      isShowDialog.value = true;
    }
  }
};
// 切换角色提交按钮
const clickConfirm = async () => {
  confirmLoading.value = true;
  const res = await changeUserRole({ authorityId: roleValue.value });
  if (res.data.code === 2000) {
    setTimeout(async () => {
      removeUserInfo();
      const result = await getUserInfo();
      setUserInfo(result.data.data.userInfo);
      window.location.reload();
    }, 600);
  } else {
    confirmLoading.value = false;
  }
};
// 切换角色取消按钮
const clickCancel = () => {
  roleValue.value = null;
  isShowDialog.value = false;
};
</script>

<template>
  <a-dropdown>
    <span
      hover="bg-[var(--hover-color)]"
      flex
      items-center
      h-48px
      px-12px
      cursor-pointer
      class="transition-all-300"
    >
      <a-avatar
        :src="avatar"
        :loadError="(loadErrorFn as any)"
        mr-8px
        size="small"
      />
      <span class="anticon">{{ nickName }}</span>
    </span>
    <template #overlay>
      <a-menu>
        <a-menu-item key="roles" class="roleMenu" @click="changeRoleFn">
          <template #icon>
            <UserSwitchOutlined />
          </template>
          <span>{{ userInfo.authority.authorityName }}</span>
          <SwapOutlined ml-2 />
        </a-menu-item>
        <a-menu-divider />
        <a-menu-item key="person">
          <template #icon>
            <UserOutlined />
          </template>
          <RouterLink to="/person">
            {{ "个人中心" }}
          </RouterLink>
        </a-menu-item>
        <a-menu-item key="logout" @click="logout">
          <template #icon>
            <LogoutOutlined />
          </template>
          退出登录
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>

  <a-modal
    title="切换角色"
    v-model:open="isShowDialog"
    :confirm-loading="confirmLoading"
    :destroyOnClose="true"
    @ok="clickConfirm"
    @cancel="clickCancel"
  >
    <a-radio-group v-model:value="roleValue">
      <a-radio
        v-for="item in roleList"
        :key="item.authorityId"
        :value="item.authorityId"
        >{{ item.authorityName }}</a-radio
      >
    </a-radio-group>
  </a-modal>
</template>

<style scoped lang="less">
.roleMenu {
  &:hover {
    .anticon-swap {
      color: #1677ff;
    }
  }
}
</style>
