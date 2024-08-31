<script setup lang="ts">
import { setSystemConfig } from "@/api/system-tools/sysConfig";
import { Form } from "ant-design-vue";

const props = defineProps({
  emailDialog: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(["update:emailDialog", "refreshList"]);

const isShowDialog = computed({
  get: () => props.emailDialog,
  set: (val) => emits("update:emailDialog", val),
});

const modalBodyStyle: any = {
  padding: "24px 48px 2px 24px",
};
const confirmLoading = ref(false);
const commonFormRef = ref<any>(null);

const formDataConfig = {
  name: "email",
  formItems: [
    {
      name: "to",
      type: "input",
      label: "To",
    },
    {
      name: "port",
      type: "inputNumber",
      label: "端口",
      style: { width: "100%" },
    },
    {
      name: "from",
      type: "input",
      label: "From",
    },
    {
      name: "host",
      type: "input",
      label: "SMTP服务器",
    },
    {
      name: "is-ssl",
      type: "select",
      label: "是否开启SSL认证",
      options: [
        {
          value: true,
          label: "开启",
        },
        {
          value: false,
          label: "关闭",
        },
      ],
    },
    {
      name: "secret",
      type: "input",
      label: "密码",
    },
    {
      name: "nickname",
      type: "input",
      label: "用户名",
    },
  ],
  rules: {
    to: [{ required: true, message: "to不能为空", trigger: "blur" }],
    from: [{ required: true, message: "from不能为空", trigger: "blur" }],
    host: [{ required: true, message: "SMTP服务器不能为空", trigger: "blur" }],
    port: [{ required: true, message: "端口不能为空", trigger: "blur" }],
    "is-ssl": [
      { required: true, message: "是否开启SSL认证不能为空", trigger: "blur" },
    ],
    secret: [{ required: true, message: "密码不能为空", trigger: "blur" }],
    nickname: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
  },
};

const initValues = reactive<any>({
  to: "",
  port: undefined,
  from: "",
  host: "",
  "is-ssl": undefined,
  secret: "",
  nickname: "",
});
const formData = ref(initValues);
const { resetFields } = Form.useForm(formData);

const editShow = (data: any, name: string) => {
  formData.value = data[name];
};
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
    result = await setSystemConfig({ email: submitData });
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
  emits("update:emailDialog", false);
};
</script>

<template>
  <a-modal
    width="60%"
    title="邮箱配置"
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
