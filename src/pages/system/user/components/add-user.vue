<script setup lang="ts">
import { modifyUserInfoFromAdmin, registerFromAdmin } from "@/api/system/user";
import { TreeSelect, Form } from "ant-design-vue";
import { formDataConfig } from "../config/form.config";
import { cloneDeep } from "lodash-es";
import { showFile } from "~@/api/file/upload";
import { useUserStore } from "@/stores";
import emitter from "@/utils/eventbus";

const { userInfo, setUserInfo } = useUserStore();
const props = defineProps({
  showDialog: {
    type: Boolean,
    default: false,
  },
  roleList: {
    type: Array,
    required: true,
  },
});
const emits = defineEmits(["update:showDialog", "refreshList"]);

const isShowDialog = computed({
  get: () => props.showDialog,
  set: (val) => emits("update:showDialog", val),
});

// 获取主题色用到的token
const token = useAntdToken();
const modalBodyStyle: any = {
  padding: "24px 48px 2px 24px",
};
const fieldNames = {
  children: "children",
  label: "authorityName",
  value: "authorityId",
};
const roleTreeData = ref([]);
const confirmLoading = ref(false);
const commonFormRef = ref<any>(null);
const UploadPictureRef = ref();

const initValues = reactive<Record<string, any>>({
  id: 0,
  authorityId: 0,
  authorities: [],
  authorityIds: [],
  email: "",
  enable: 1,
  phone: "",
  nickName: "",
  headerImg: "",
});
const formData = ref(initValues);
const { resetFields } = Form.useForm(formData);

// 选择用户角色
const treeChangeFn = (value: object[]) => {
  formData.value["authorityIds"] = value;
};
const treeSelectFn = (value: any, node: Record<string, any>) => {
  console.log("treeSelectFn", value, node);
  if (
    formData.value["authorities"] &&
    !formData.value["authorities"].some(
      (v: any) => v.authorityId === node.authorityId
    )
  ) {
    formData.value["authorities"].push(node);
  }
};

// 头像上传成功后url存入formData
const uploadResFn = (url: string) => {
  formData.value["headerImg"] = url;
};

const editShow = async (data: Record<string, any>) => {
  Object.keys(formData.value).forEach((key) => {
    formData.value[key] = data[key];
  });
  formData.value["authorityId"] = data.authorityId;
  formData.value["authorityIds"] = data.authorities.map((val: any) => {
    val["label"] = val.authorityName;
    val["value"] = val.authorityId;
    return val;
  });
  const list = cloneDeep(props.roleList);
  // 编辑弹窗时，需要禁止用户删掉他自己对应的角色
  roleTreeData.value = dataTranfer(list, data.authorityId);
  // 回显用户头像
  if (formData.value.headerImg) {
    const res = await showFile(formData.value.headerImg);
    let imgUrl = URL.createObjectURL(res.request.response);
    UploadPictureRef.value.showImg({
      name: formData.value.nickName,
      status: "done",
      url: formData.value.headerImg.includes("http")
        ? formData.value.headerImg
        : imgUrl,
    });
  }

  console.log("formData.value", formData.value);
};
// 主动暴露editShow方法
defineExpose({ editShow });

const dataTranfer = (arr: any, id: number) => {
  let list: any = [];
  arr.map((value: any) => {
    if (value.authorityId === id) {
      value["disabled"] = true;
    }
    list.push(value);
    if (value.children && value.children.length) {
      value.children = dataTranfer(value.children, id);
    }
    return value;
  });
  return list;
};

// 确认提交表单数据
const clickConfirm = async () => {
  try {
    await commonFormRef.value.formRef.validateFields();
    const submitData = JSON.parse(JSON.stringify(formData.value));

    submitData["authorityIds"] = submitData["authorityIds"].map(
      (val: any) => val.value
    );
    delete submitData.authorities;
    let result;
    confirmLoading.value = true;
    if (formData.value.id) {
      delete submitData.authorityId;
      result = await modifyUserInfoFromAdmin(submitData);
    } else {
      delete submitData.id;
      delete submitData.nickName;

      // 新增用户时，默认给用户赋值角色数组内第一个角色
      submitData["authorityId"] = submitData["authorityIds"][0];
      result = await registerFromAdmin(submitData);
    }

    confirmLoading.value = false;
    if (result?.data.code === 2000) {
      if (submitData.id === userInfo.id) {
        userInfo.headerImg = submitData.headerImg;
        userInfo.headerFile.url = submitData.headerImg;
        userInfo.nickName = submitData.nickName;
        userInfo.authorityId = submitData.authorityId;
        userInfo.authorityIds = submitData.authorityIds;
        userInfo.phone = submitData.phone;
        userInfo.email = submitData.email;
        setUserInfo(userInfo);
        emitter.emit("changeUserAvatar", userInfo);
      }

      clickCancel();
    }
  } catch (error) {
    confirmLoading.value = false;
    console.log("表单校验错误", error);
  }
};

// 关闭弹窗
const clickCancel = () => {
  // 清空表单校验
  resetFields();
  roleTreeData.value = [];
  emits("refreshList"); // 更新数据
  emits("update:showDialog", false);
};

onUnmounted(() => {
  emitter.off("changeUserAvatar");
  console.log("销毁了当前页面的emitter", emitter.all);
});
</script>

<template>
  <a-modal
    width="60%"
    :title="
      formData.id ? `编辑${formDataConfig.name}` : `新增${formDataConfig.name}`
    "
    v-model:open="isShowDialog"
    :confirm-loading="confirmLoading"
    :bodyStyle="modalBodyStyle"
    :destroyOnClose="true"
    @ok="clickConfirm"
    @cancel="clickCancel"
  >
    <CommonForm ref="commonFormRef" v-model="formData" v-bind="formDataConfig">
      <template #formSlot_1>
        <a-tree-select
          style="width: 100%"
          allow-clear
          show-search
          :treeCheckable="true"
          :fieldNames="fieldNames"
          :tree-data="((roleTreeData.length ? roleTreeData : roleList) as any)"
          :show-checked-strategy="TreeSelect.SHOW_ALL"
          :treeCheckStrictly="true"
          placeholder="请选择角色"
          :value="formData['authorityIds']"
          @change="treeChangeFn"
          @select="treeSelectFn"
        >
          <template #tagRender="{ label, value, closable, onClose }">
            <template v-if="formData.id">
              <a-tag
                :closable="formData.authorityId !== value"
                style="margin-right: 3px"
                :color="
                  (formData['authorityIds'] &&
                  formData['authorityIds'].length &&
                  value === formData.authorityId
                    ? token?.colorPrimary
                    : null) as any
                "
                @close="onClose"
              >
                {{ label }}&nbsp;&nbsp;
              </a-tag>
            </template>
            <template v-else>
              <a-tag
                :closable="closable"
                :color="
                  (formData['authorityIds'] &&
                  formData['authorityIds'].length &&
                  formData['authorityIds'][0].label === label
                    ? token?.colorPrimary
                    : null) as any
                "
                style="margin-right: 3px"
                @close="onClose"
              >
                {{ label }}&nbsp;&nbsp;
              </a-tag>
            </template>
          </template>
        </a-tree-select>
      </template>
      <template #formSlot_2>
        <UploadPicture
          ref="UploadPictureRef"
          @uploadRes="uploadResFn"
        ></UploadPicture>
      </template>
    </CommonForm>
  </a-modal>
</template>

<style scoped></style>
