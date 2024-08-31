<script setup lang="ts">
import { setSystemConfig } from "@/api/system-tools/sysConfig";
import { Form } from "ant-design-vue";

const props = defineProps({
  captchaDialog: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(["update:captchaDialog", "refreshList"]);

const isShowDialog = computed({
  get: () => props.captchaDialog,
  set: (val) => emits("update:captchaDialog", val),
});

const modalBodyStyle: any = {
  padding: "24px 48px 2px 24px",
};
const confirmLoading = ref(false);
const commonFormRef = ref<any>(null);

const formDataConfig = {
  name: "captcha",
  formItems: [
    {
      name: "key-long",
      type: "inputNumber",
      label: "密钥长度",
      style: { width: "100%" },
    },
    {
      name: "img-width",
      type: "inputNumber",
      label: "图片宽度",
      style: { width: "100%" },
    },
    {
      name: "img-height",
      type: "inputNumber",
      label: "图片高度",
      style: { width: "100%" },
    },
  ],
  rules: {
    "key-long": [
      { required: true, message: "密钥长度不能为空", trigger: "blur" },
    ],
    "img-width": [
      { required: true, message: "图片宽度不能为空", trigger: "blur" },
    ],
    "img-height": [
      { required: true, message: "图片高度不能为空", trigger: "blur" },
    ],
  },
};

const initValues = reactive<any>({
  "key-long": undefined,
  "img-width": undefined,
  "img-height": undefined,
});
const formData = ref(initValues);
const { resetFields } = Form.useForm(formData);

const editShow = (data: any, name: string) => {
  formData.value = data[name];
};
// 主动暴露editShow方法
defineExpose({ editShow });

const selectChangeFn = (value: any, name: string) => {
  formData.value[name] = value;
};

// 确认提交表单数据
const clickConfirm = async () => {
  try {
    await commonFormRef.value.formRef.validateFields();
    const submitData = JSON.parse(JSON.stringify(formData.value));

    let result;
    confirmLoading.value = true;
    result = await setSystemConfig({ captcha: submitData });
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
  emits("update:captchaDialog", false);
};
</script>

<template>
  <a-modal
    width="60%"
    title="验证配置"
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
      @selectChangeFn="selectChangeFn"
    />
  </a-modal>
</template>

<style scoped></style>
