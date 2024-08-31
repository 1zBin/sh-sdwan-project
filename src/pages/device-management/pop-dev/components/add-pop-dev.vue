<script setup lang="ts">
import { createPopDev, updatePopDev } from "@/api/pop/popDev";
import { Form } from "ant-design-vue";
import { formDataConfig } from "../config/form.config";
import { dataDifferent } from "@/utils/changeFormData.ts";
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
  maxHeight: "80vh",
  overflowY: "auto",
};
const confirmLoading = ref(false);
const commonFormRef = ref<any>(null);

let originalData = {};
const initValues = reactive<Record<string, any>>({
  id: undefined, // *
  address: "", // *
  apiPort: undefined,
  apisPort: undefined,
  comment: "",
  identifier: "",
  manageAccount: "", // *
  manageIP: "", // *
  managePassword: "", // *
  name: "", // *
  popKind: [],
  popKindIds: [], // *
  priority: undefined,
  ovpnPort: undefined,
  sshPort: undefined,
  sstpPort: undefined,
  useTls: "",
  warranty: "",
});
const formData = ref(initValues);
const { resetFields } = Form.useForm(formData);

const editShow = async (data: Record<string, any>) => {
  Object.keys(formData.value).forEach((key) => {
    formData.value[key] = data[key];
  });
  if (formData.value["popKind"] && formData.value["popKind"].length) {
    formData.value["popKindIds"] = formData.value["popKind"].map(
      (val: Record<string, any>) => val.id
    );
  } else {
    formData.value["popKind"] = [];
    formData.value["popKindIds"] = [];
  }
  originalData = _.cloneDeep(formData.value);
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
    delete submitData.popKind;

    let result;
    confirmLoading.value = true;
    if (formData.value.id) {
      submitData = dataDifferent(formData.value, originalData);
      delete submitData.name;
      result = await updatePopDev(submitData);
    } else {
      delete submitData.id;
      result = await createPopDev(submitData);
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
    centered
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
      <template #formSlot_1>
        <MTableCheckbox
          v-model="formData"
          :parameters="{
            describe: 'POP类型列表',
            nameValue: 'kind',
            name: 'popKind',
            ids: 'popKindIds',
            path: '../../pages/device-management/pop-kind/index.vue',
          }"
        ></MTableCheckbox>
      </template>
    </CommonForm>
  </a-modal>
</template>

<style scoped></style>
