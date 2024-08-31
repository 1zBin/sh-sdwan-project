<template>
  <a-modal
    :title="titleShow"
    :confirm-loading="confirmLoading"
    @ok="btnOK"
    @cancel="closeDialog"
    v-model:open="isShowDialog"
  >
    <a-form :labelCol="{ span: 4 }" :model="formData" ref="formRef">
      <a-form-item
        v-if="numShow === 1"
        label="手机号"
        name="mobile"
        v-bind="validateInfos.phone"
      >
        <a-input
          v-model:value.trim="formData.phone"
          placeholder="请输入手机号"
        ></a-input>
      </a-form-item>
      <a-form-item
        v-else-if="numShow === 2"
        label="电子邮箱"
        name="email"
        v-bind="validateInfos.email"
      >
        <a-input
          v-model:value.trim="formData.email"
          placeholder="请输入邮箱地址"
        ></a-input>
      </a-form-item>
      <a-form-item
        v-else-if="numShow === 3"
        label="原密码"
        name="password"
        v-bind="validateInfos.password"
      >
        <a-input
          v-model:value.trim="formData.password"
          placeholder="请输入密码"
        ></a-input>
      </a-form-item>
      <a-form-item
        v-show="numShow === 3"
        has-feedback
        label="新密码"
        name="newPassword"
        v-bind="validateInfos.newPassword"
      >
        <a-input
          v-model:value.trim="formData.newPassword"
          type="password"
          autocomplete="off"
        />
      </a-form-item>
      <a-form-item
        v-show="numShow === 3"
        has-feedback
        label="再次确认"
        name="confirmNewPassword"
        v-bind="validateInfos.confirmNewPassword"
      >
        <a-input
          v-model:value.trim="formData.confirmNewPassword"
          type="password"
          autocomplete="off"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { Form } from "ant-design-vue";
import { useLogout, useMultiTab } from "@/stores";
import { modifyUserInfoSelf, changePassword } from "@/api/system/user";

const { logoutFn } = useLogout();
const { clearAllTab } = useMultiTab();
const confirmLoading = ref(false);
const props = defineProps({
  showDialog: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(["update:showDialog", "refreshInfo"]);

const isShowDialog = computed({
  get: () => props.showDialog,
  set: (val) => emits("update:showDialog", val),
});

const initValues = reactive({
  phone: "",
  email: "",
  password: "",
  newPassword: "",
  confirmNewPassword: "",
});

const formRef = ref();
let validatePass = async (_rule: any, value: any) => {
  if (value === "") {
    return Promise.reject("请输入密码！");
  } else {
    if (formData.value.confirmNewPassword !== "") {
      formRef.value.validateFields("confirmNewPassword");
    }
    return Promise.resolve();
  }
};
let validatePass2 = async (_rule: any, value: any) => {
  if (value === "") {
    return Promise.reject("请再次输入密码！");
  } else if (value !== formData.value.newPassword) {
    return Promise.reject("两次输入密码不匹配！");
  } else {
    return Promise.resolve();
  }
};

const formData = ref(initValues);
const rules = reactive({
  phone: [
    { required: true, message: "手机号不能为空", trigger: "blur" },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: "手机号格式不正确",
      trigger: "blur",
    },
  ],
  email: [
    { required: true, message: "请输入你的邮箱", trigger: "blur" },
    {
      type: "email",
      pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
      min: 9,
      max: 18,
      message: "邮箱格式错误",
      trigger: "blur",
    },
  ],
  password: [
    { required: true, message: "密码不能为空", trigger: "blur" },
    {
      min: 3,
      max: 18,
      message: "密码长度为3-18个字符",
      trigger: "blur",
    },
  ],
  newPassword: [
    {
      required: true,
      validator: validatePass,
      trigger: "change",
    },
    {
      min: 3,
      max: 18,
      message: "密码长度为3-18个字符",
      trigger: "blur",
    },
  ],
  confirmNewPassword: [
    {
      required: true,
      validator: validatePass2,
      trigger: "change",
    },
    {
      min: 3,
      max: 18,
      message: "密码长度为3-18个字符",
      trigger: "blur",
    },
  ],
});
// resetFields    重置表单
// validate       校验表单
// validateInfos  校验信息(用于模板绑定)
const { resetFields, validate, validateInfos } = Form.useForm(formData, rules);

const titleShow = ref("");
const numShow = ref(0);
const editShow = (data: any, num: number) => {
  if (num === 1) {
    titleShow.value = "修改手机号码";
  } else if (num === 2) {
    titleShow.value = "修改电子邮箱";
  } else {
    titleShow.value = "修改密码";
  }
  numShow.value = num;

  formData.value = data;
  console.log("编辑弹窗", formData.value);
};
// 主动暴露editShow方法
defineExpose({ editShow });

// 提交表单数据
const btnOK = async () => {
  try {
    await validate();
    let submitData: any = {};
    let result;
    confirmLoading.value = true;
    if (numShow.value === 3) {
      submitData["password"] = formData.value["password"];
      submitData["newPassword"] = formData.value["newPassword"];
      submitData["confirmNewPassword"] = formData.value["confirmNewPassword"];
      result = await changePassword(submitData);
      if (result.data.code === 2000) {
        setTimeout(() => {
          logoutFn();
          clearAllTab();
          confirmLoading.value = false;
        }, 600);
      }
    } else {
      submitData = JSON.parse(JSON.stringify(formData.value));
      delete submitData["password"];
      delete submitData["newPassword"];
      delete submitData["confirmNewPassword"];
      result = await modifyUserInfoSelf(submitData);
      if (result.data.code === 2000) {
        closeDialog();
        confirmLoading.value = false;
        emits("refreshInfo");
      }
    }
  } catch (error) {
    confirmLoading.value = false;
    return;
  }
};

const closeDialog = () => {
  // 清空表单校验
  resetFields();
  emits("update:showDialog", false);
};
</script>

<style scoped></style>
