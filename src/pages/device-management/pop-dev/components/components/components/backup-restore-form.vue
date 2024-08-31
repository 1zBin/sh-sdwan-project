<script setup lang="ts">
import { backup } from "@/api/device/backupRestore";
import { Form } from "ant-design-vue";
import _ from "lodash";

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
  // maxHeight: "80vh",
  // overflowY: "auto",
};
const formDataConfig = {
  name: "设备备份",
  formItems: [
    // {
    //   name: "backupType",
    //   type: "select",
    //   label: "备份类型",
    //   placeholder: "请选择备份类型",
    //   options: [
    //     {
    //       value: "1",
    //       label: "自动备份",
    //     },
    //     {
    //       value: "2",
    //       label: "手动备份",
    //     },
    //     {
    //       value: "3",
    //       label: "配置更变备份",
    //     },
    //     {
    //       value: "4",
    //       label: "进行恢复时备份",
    //     },
    //   ],
    // },
    {
      name: "comment",
      type: "textarea",
      label: "备注",
      placeholder: "请输入备注",
      rows: 1,
      colXlSpan: 24,
      colXxlSpan: 24,
      labelXlCol: { span: 4 },
      labelXxlCol: { span: 4 },
    },
  ],
  rules: {
    backupType: [
      { required: true, message: "备份类型不能为空", trigger: "blur" },
    ],
    fullPath: [
      {
        required: true,
        message: "文件在控制器中的存储路径不能为空",
        trigger: "blur",
      },
    ],
  },
};
const confirmLoading = ref(false);
const commonFormRef = ref<any>(null);

const initValues = reactive<Record<string, any>>({
  backupType: "2", // *
  popDevID: undefined,
  comment: "",
});
const formData = ref(initValues);
const { resetFields } = Form.useForm(formData);

const editShow = async (id: number) => {
  formData.value.popDevID = id;
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
    let submitData = _.cloneDeep(formData.value);

    let result;
    confirmLoading.value = true;
    result = await backup(submitData);
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
    :title="'备份设备'"
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
