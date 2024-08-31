<script setup lang="ts">
import { createRole, updateRole, copyRole } from "@/api/system/role";
import { Form } from "ant-design-vue";
import { formDataConfig } from "../config/form.config";
import { cloneDeep } from "lodash-es";

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
const isCopy = ref(false);

const initValues = reactive<Record<string, any>>({
  id: undefined,
  parentId: undefined,
  authorityId: undefined,
  authorityName: "",
  defaultRouter: "",
  menus: [],
  children: [],
  dataAuthorityId: [],
  parentName: "根角色",
});
const formData = ref(initValues);
const { resetFields } = Form.useForm(formData);

const addSonShow = (data: Record<string, any>) => {
  formData.value.parentName = data.authorityName;
  formData.value.parentId = data.authorityId;
  console.log("addSonShow", data, formData.value);
};
const editShow = (data: Record<string, any>) => {
  Object.keys(formData.value).forEach((key) => {
    formData.value[key] = data[key];
  });
};
const copyShow = (data: Record<string, any>) => {
  isCopy.value = true;
  formData.value.id = data.id;
  formData.value.parentName = data.parentName;
  formData.value["dstAuthorityName"] = "";
  formData.value["srcAuthorityId"] = data.authorityId;
};
// 主动暴露editShow方法
defineExpose({ addSonShow, editShow, copyShow });

// 确认提交表单数据
const clickConfirm = async () => {
  try {
    await commonFormRef.value.formRef.validateFields();
    const submitData = cloneDeep(formData.value);
    console.log("提交前的数据", submitData);

    let result;
    confirmLoading.value = true;
    if (submitData.srcAuthorityId) {
      const copyData = {
        dstAuthorityName: submitData.authorityName,
        srcAuthorityId: submitData.srcAuthorityId,
      };
      console.log("拷贝角色", copyData);
      result = await copyRole(copyData);
    } else if (submitData.authorityId && !submitData.srcAuthorityId) {
      result = await updateRole(submitData);
    } else {
      delete submitData.id;
      result = await createRole(submitData);
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
  isCopy.value = false;
  delete formData.value.dstAuthorityName;
  delete formData.value.srcAuthorityId;
  emits("refreshList"); // 更新数据
  emits("update:showDialog", false);
};
</script>

<template>
  <a-modal
    width="60%"
    :title="
      !formData.id
        ? `新增${formDataConfig.name}`
        : !isCopy
        ? `编辑${formDataConfig.name}`
        : `拷贝${formDataConfig.name}`
    "
    v-model:open="isShowDialog"
    :confirm-loading="confirmLoading"
    :bodyStyle="modalBodyStyle"
    :destroyOnClose="true"
    @ok="clickConfirm"
    @cancel="clickCancel"
  >
    <CommonForm ref="commonFormRef" v-model="formData" v-bind="formDataConfig">
    </CommonForm>
  </a-modal>
</template>

<style scoped></style>
