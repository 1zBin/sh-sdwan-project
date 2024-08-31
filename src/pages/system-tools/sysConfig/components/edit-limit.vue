<script setup lang="ts">
import { setSystemConfig } from "@/api/system-tools/sysConfig";
import { Form } from "ant-design-vue";

const props = defineProps({
  limitDialog: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(["update:limitDialog", "refreshList"]);

const isShowDialog = computed({
  get: () => props.limitDialog,
  set: (val) => emits("update:limitDialog", val),
});

const modalBodyStyle: any = {
  padding: "24px 48px 2px 24px",
};
const confirmLoading = ref(false);
const commonFormRef = ref<any>(null);

const formDataConfig = {
  name: "limit",
  formItems: [
    {
      name: "dayMaxCount",
      type: "inputNumber",
      label: "每日上限",
      style: { width: "100%" },
    },
    {
      name: "intervalSeconds",
      type: "inputNumber",
      label: "间隔时间",
      style: { width: "100%" },
    },
    {
      name: "retryCount",
      type: "inputNumber",
      label: "尝试次数",
      style: { width: "100%" },
    },
  ],
  rules: {
    dayMaxCount: [
      { required: true, message: "每日上限不能为空", trigger: "blur" },
    ],
    intervalSeconds: [
      { required: true, message: "间隔时间不能为空", trigger: "blur" },
    ],
    retryCount: [
      { required: true, message: "尝试次数不能为空", trigger: "blur" },
    ],
  },
};

const initValues = reactive<any>({
  dayMaxCount: undefined,
  intervalSeconds: undefined,
  retryCount: undefined,
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
    result = await setSystemConfig({ ["user-login-limit"]: submitData });
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
  emits("update:limitDialog", false);
};
</script>

<template>
  <a-modal
    width="60%"
    title="封禁配置"
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
