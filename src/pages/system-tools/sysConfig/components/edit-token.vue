<script setup lang="ts">
import { setSystemConfig } from "@/api/system-tools/sysConfig";
import { Form } from "ant-design-vue";

const props = defineProps({
  tokenDialog: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(["update:tokenDialog", "refreshList"]);

const isShowDialog = computed({
  get: () => props.tokenDialog,
  set: (val) => emits("update:tokenDialog", val),
});

const modalBodyStyle: any = {
  padding: "24px 48px 2px 24px",
};
const confirmLoading = ref(false);
const commonFormRef = ref<any>(null);

const formDataConfig = {
  name: "token",
  formItems: [
    {
      name: "signing-key",
      type: "input",
      label: "密钥",
    },
    {
      name: "expires-time",
      type: "input",
      label: "过期时间",
    },
    {
      name: "buffer-time",
      type: "input",
      label: "缓冲时间",
    },
    {
      name: "issuer",
      type: "input",
      label: "签发者",
    },
  ],
  rules: {
    "signing-key": [
      { required: true, message: "密钥不能为空", trigger: "blur" },
    ],
    "expires-time": [
      { required: true, message: "过期时间不能为空", trigger: "blur" },
    ],
    "buffer-time": [
      { required: true, message: "缓冲时间不能为空", trigger: "blur" },
    ],
    issuer: [{ required: true, message: "签发者不能为空", trigger: "blur" }],
  },
};

const initValues = reactive<any>({
  "signing-key": "",
  "expires-time": "",
  "buffer-time": "",
  issuer: "",
});
const formData = ref(initValues);
const { resetFields } = Form.useForm(formData);

const editShow = (data: any, name: string) => {
  formData.value = data[name];
};
// 主动暴露editShow方法
defineExpose({ editShow });

// 确认提交表单数据
const clickConfirm = async () => {
  try {
    await commonFormRef.value.formRef.validateFields();
    const submitData = JSON.parse(JSON.stringify(formData.value));

    let result;
    confirmLoading.value = true;
    result = await setSystemConfig({ token: submitData });
    confirmLoading.value = false;
    if (result?.data.code === 2000) {
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
  emits("refreshList"); // 更新数据
  emits("update:tokenDialog", false);
};
</script>

<template>
  <a-modal
    width="60%"
    title="Token配置"
    v-model:open="isShowDialog"
    :confirm-loading="confirmLoading"
    :bodyStyle="modalBodyStyle"
    :destroyOnClose="true"
    @ok="clickConfirm"
    @cancel="clickCancel"
  >
    <CommonForm
      ref="commonFormRef"
      v-model="formData"
      v-bind="formDataConfig"
    />
  </a-modal>
</template>

<style scoped></style>
