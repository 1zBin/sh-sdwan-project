<script setup lang="ts">
import { setSystemConfig } from "@/api/system-tools/sysConfig";
import { Form } from "ant-design-vue";
import { cloneDeep } from "lodash-es";

const props = defineProps({
  providersDialog: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(["update:providersDialog", "refreshList"]);

const isShowDialog = computed({
  get: () => props.providersDialog,
  set: (val) => emits("update:providersDialog", val),
});

const modalBodyStyle: any = {
  padding: "24px 48px 2px 24px",
};
const confirmLoading = ref(false);
const commonFormRef = ref<any>(null);

const formDataConfig = {
  name: "providers",
  formItems: [
    {
      name: "providerName",
      type: "input",
      label: "提供商名称",
    },
    {
      name: "templateCode",
      type: "input",
      label: "模板ID",
    },
    {
      name: "templateSignName",
      type: "input",
      label: "模板签名",
    },
    {
      name: "accessID",
      type: "input",
      label: "访问ID",
    },
    {
      name: "accessSecret",
      type: "input",
      label: "访问密码",
    },
    {
      name: "length",
      type: "inputNumber",
      label: "验证码长度",
      style: { width: "100%" },
    },
    {
      name: "effective",
      type: "inputNumber",
      label: "验证码有效时间",
      style: { width: "100%" },
    },
    {
      name: "intervalSeconds",
      type: "inputNumber",
      label: "验证码请求间隙",
      style: { width: "100%" },
    },
    {
      name: "timerCleanSms",
      type: "inputNumber",
      label: "验证码定时清理",
      style: { width: "100%" },
    },
  ],
  rules: {
    providerName: [
      { required: true, message: "提供商名称不能为空", trigger: "blur" },
    ],
    templateCode: [
      { required: true, message: "模板ID不能为空", trigger: "blur" },
    ],
    templateSignName: [
      { required: true, message: "模板签名不能为空", trigger: "blur" },
    ],
    accessID: [{ required: true, message: "访问ID不能为空", trigger: "blur" }],
    accessSecret: [
      { required: true, message: "访问密码不能为空", trigger: "blur" },
    ],
    effective: [
      { required: true, message: "验证码有效时间不能为空", trigger: "blur" },
    ],
    length: [
      { required: true, message: "验证码长度不能为空", trigger: "blur" },
    ],
    intervalSeconds: [
      { required: true, message: "验证码长度不能为空", trigger: "blur" },
    ],
    timerCleanSms: [
      { required: true, message: "验证码长度不能为空", trigger: "blur" },
    ],
  },
};

export interface ProviderModel {
  accessID: string;
  accessSecret: string;
  effective?: number;
  length?: number;
  providerName: string;
  templateCode: string;
  templateSignName: string;
  intervalSeconds?: number;
  timerCleanSms?: number;
  index?: number;
}

const initValues = reactive<ProviderModel>({
  providerName: "",
  templateCode: "",
  templateSignName: "",
  accessID: "",
  accessSecret: "",
  effective: undefined,
  length: undefined,
  intervalSeconds: undefined,
  timerCleanSms: undefined,
});
const formData = ref<any>(initValues);
const { resetFields } = Form.useForm(formData);
const formDataList = ref<ProviderModel[]>([]);

const editShow = (data: any, name: string, record: Record<string, any>) => {
  let list = cloneDeep(data[name]);
  formDataList.value = list;
  formData.value = list.find(
    (v: Record<string, any>) => v.accessID === record.accessID
  );
  const index = list.findIndex(
    (v: Record<string, any>) => v.accessID === record.accessID
  );
  formData.value["index"] = index;
};
// 主动暴露editShow方法
defineExpose({ editShow });

// 确认提交表单数据
const clickConfirm = async () => {
  try {
    await commonFormRef.value.formRef.validateFields();
    const submitData = cloneDeep(formData.value);

    formDataList.value.splice(formData.value["index"], 1, submitData);
    let result;
    confirmLoading.value = true;
    result = await setSystemConfig({
      "sms-verification": { providers: formDataList.value },
    });
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
  emits("update:providersDialog", false);
};
</script>

<template>
  <a-modal
    width="60%"
    title="编辑提供商信息"
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
