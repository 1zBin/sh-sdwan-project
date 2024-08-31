<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useUserStore } from "@/stores";
import EditInfo from "./components/editInfo.vue";
import { modifyUserInfoSelf } from "@/api/system/user";
import { message } from "ant-design-vue";
import { showFile, deleteFile } from "@/api/file/upload";
import emitter from "@/utils/eventbus";

const dialogForm = ref();
const showDialog = ref(false);

const { getUserInfo, setUserInfo } = useUserStore();
const userInfo = ref<any>({});
const nameValue = ref(userInfo.nickName);
const nameInputShow = ref(false);
const UploadPictureRef = ref();

onMounted(() => {
  getUesrInfo();
});

const getUesrInfo = async () => {
  const res = await usePost("/user/getUserInfoSelf");
  userInfo.value = res.data.data.userInfo;

  if (userInfo.value["headerFile"].url) {
    const res = await showFile(userInfo.value["headerFile"].url);
    let imgUrl = URL.createObjectURL(res.request.response);
    UploadPictureRef.value.showImg({
      uid: userInfo.value["uuid"],
      name: userInfo.value["nickName"],
      status: "done",
      url: userInfo.value["headerFile"].url.includes("http")
        ? userInfo.value["headerFile"].url
        : imgUrl,
    });
  } else {
    userInfo.value["headerImg"] = "";
  }
};

const refreshInfo = async () => {
  const res = await getUserInfo();
  console.log("更新用户信息", res.data.data.userInfo);
};

// 修改昵称
const changeNameFn = async () => {
  if (nameValue.value && nameValue.value.length < 8) {
    userInfo.value["nickName"] = nameValue.value;
    await modifyUserInfoSelf(userInfo.value);
  } else if (nameValue.value.length > 8) {
    message.warn("昵称不能超过8个字符！");
  } else if (nameValue.value.length == 0) {
    message.warn("昵称不能为空！");
  }

  nameInputShow.value = false;
  nameValue.value = "";
};

// 编辑信息
const editDialogShow = (num: number) => {
  showDialog.value = true;
  dialogForm.value.editShow(userInfo.value, num);
};

// 头像上传成功后url存入formData
const uploadResFn = async (url: string) => {
  userInfo.value.headerImg = url;
  userInfo.value["headerFile"].url = url;
  if (url) {
    await modifyUserInfoSelf(userInfo.value);
  } else {
    const res = await deleteFile({ id: userInfo.value["headerFile"].id });
    if (res.data.code === 2000) {
      getUesrInfo();
    }
  }
  setUserInfo(userInfo.value);
  emitter.emit("changeUserAvatar", userInfo.value);
};

onUnmounted(() => {
  emitter.off("changeUserAvatar");
  console.log("销毁了当前页面的emitter", emitter.all);
});
</script>

<template>
  <div>
    <div class="person-container" flex justify-content-center w-full>
      <a-card
        style="width: 310px; cursor: auto"
        title="个人信息"
        :headStyle="{ fontSize: '20px', fontWeight: '900' }"
        :bordered="false"
        hoverable
      >
        <div class="userInfo">
          <div class="userInfo-top">
            <UploadPicture
              ref="UploadPictureRef"
              @uploadRes="uploadResFn"
            ></UploadPicture>
            <div v-if="nameInputShow">
              <a-input
                v-model:value.trim="nameValue"
                style="width: 120px; height: 30px; margin: 6px 0 8px 0"
              >
              </a-input>
              <CheckOutlined
                @click="changeNameFn()"
                style="font-size: 20px; margin: 0 5px 0 5px; color: #67c23a"
              />
              <CloseOutlined
                @click="nameInputShow = false"
                style="font-size: 20px; color: #f23c3c"
              />
            </div>
            <h2 v-else-if="!nameInputShow">
              {{ userInfo.nickName }}
              <FormOutlined
                @click="
                  () => {
                    nameInputShow = true;
                    nameValue = userInfo.nickName;
                  }
                "
                style="color: #66b1ff"
              />
            </h2>
            <p>这家伙很懒，什么都没有留下</p>
          </div>
          <div class="userInfo-body">
            <p>
              <UserOutlined /><span>{{ userInfo.userName }}</span>
            </p>
            <p><BankOutlined /><span>广州市舜航信息科技有限公司</span></p>
            <p><EnvironmentOutlined /><span>广东·广州·天河区</span></p>
          </div>
        </div>
      </a-card>

      <a-card
        title="账号绑定"
        :headStyle="{ fontSize: '20px', fontWeight: '900' }"
        :bordered="false"
        hoverable
        style="flex: 1; margin-left: 15px; cursor: auto"
      >
        <div style="padding: 25px">
          <div class="accountInfo">
            <h2>手机号码</h2>
            <div class="infoBox">
              <span>已绑定手机号码：{{ userInfo.phone }}</span>
              <a @click="editDialogShow(1)">立即修改</a>
            </div>
          </div>
          <div class="accountInfo">
            <h2>电子邮箱</h2>
            <div class="infoBox">
              <span>已绑定电子邮箱：{{ userInfo.email }}</span>
              <a @click="editDialogShow(2)">立即修改</a>
            </div>
          </div>
          <div class="accountInfo">
            <h2>修改密码</h2>
            <div class="infoBox">
              <span>修改个人密码</span>
              <a @click="editDialogShow(3)">立即修改</a>
            </div>
          </div>
        </div>
      </a-card>
    </div>
    <EditInfo
      v-model:show-dialog="showDialog"
      ref="dialogForm"
      @refreshInfo="refreshInfo"
    ></EditInfo>
  </div>
</template>

<style scoped lang="less">
.person-container {
  height: 100%;
  display: flex;

  :deep(.ant-card) {
    height: 65vh;
    .ant-card-body {
      height: 100%;
    }

    .ant-upload-list-picture-card-container,
    .ant-upload.ant-upload-select-picture-card {
      width: 150px;
      height: 150px;
    }
    .ant-upload-list-picture-card .ant-upload-list-item-info::before {
      left: 0;
    }
  }
  .userInfo {
    display: flex;
    flex-direction: column;

    .userInfo-top {
      text-align: center;
      p {
        color: #606266;
      }
    }

    .userInfo-body {
      margin-top: 20px;
      p {
        color: #606266;
        font-size: 16px;
        span {
          margin-left: 10px;
        }
      }
    }
  }

  .accountInfo {
    margin-bottom: 20px;
    h2 {
      font-weight: 900;
    }
    .infoBox {
      color: #a9a9a9;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
