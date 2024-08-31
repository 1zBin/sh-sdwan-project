<script setup lang="ts">
import { createApi, updateApi } from "@/api/system/api";
import { Form } from "ant-design-vue";
import { formDataConfig } from "../config/form.config";

const props = defineProps({
  showDialog: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(["update:showDialog", "refreshList"]);

const isShowDialog = computed({
  get: () => props.showDialog,
  set: (val) => emits("update:showDialog", val),
});

const modalBodyStyle: any = {
  padding: "24px 48px 2px 24px",
};
const confirmLoading = ref(false);
const commonFormRef = ref<any>(null);

const initValues = reactive<Record<string, any>>({
  apiGroup: "",
  description: "",
  id: undefined,
  method: "",
  path: "",
  CreatedAt: "",
});
const formData = ref(initValues);
const { resetFields } = Form.useForm(formData);

const editShow = async (data: Record<string, any>) => {
  Object.keys(formData.value).forEach((key) => {
    formData.value[key] = data[key];
  });
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
    if (formData.value.id) {
      result = await updateApi(submitData);
    } else {
      delete submitData.id;
      result = await createApi(submitData);
    }

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
  emits("update:showDialog", false);
};
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
    <CommonForm
      ref="commonFormRef"
      v-model="formData"
      v-bind="formDataConfig"
      @selectChangeFn="selectChangeFn"
    >
    </CommonForm>
  </a-modal>
</template>

<style scoped></style>
