<script setup lang="ts">
import {
  addInterfaceBridgePort,
  setInterfaceBridgePort,
} from "@/api/device/bridge.ts";
import { getInterfaceList } from "@/api/device/devApi";
import { Form } from "ant-design-vue";
import { formDataConfig } from "../config/form.config";

const props = defineProps({
  interfaceBridgeID: {
    type: Number,
    required: true,
  },
  cpeId: {
    type: Number,
    required: true,
  },
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
const devOptions = ref<any>([]);

const initValues = reactive<Record<string, any>>({
  id: undefined,
  comment: "",
  devPort: undefined,
  cpeDevID: props.cpeId,
  interfaceBridgeID: props.interfaceBridgeID,
  disabled: "no",
  skipControlerAndDevConsistencyCheck: "no",
});
const formData = ref(initValues);
const { resetFields } = Form.useForm(formData);

onMounted(() => {
  getDevOptions();
});
// 获取设备接口列表
const getDevOptions = async () => {
  const res = await getInterfaceList({
    devID: props.cpeId,
    devType: "cpe",
  });
  if (res.data.code === 2000) {
    devOptions.value = [
      { value: "", label: "" },
      ...res.data.data.interfaceList.map((val: string) => {
        return {
          value: val,
          label: val,
        };
      }),
    ];
  }
};

const devPortChange = (value: any, name: string) => {
  formData.value[name] = value;
};

const editShow = async (data: Record<string, any>) => {
  Object.keys(formData.value).forEach((key) => {
    formData.value[key] = data[key];
  });
  if (!formData.value["skipControlerAndDevConsistencyCheck"]) {
    formData.value["skipControlerAndDevConsistencyCheck"] = "no";
  }
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
    if (submitData["skipControlerAndDevConsistencyCheck"] === "no") {
      delete submitData["skipControlerAndDevConsistencyCheck"];
    }
    let result;
    confirmLoading.value = true;
    if (formData.value.id) {
      submitData["cpeDevID"] = props.cpeId;
      delete submitData["interfaceBridgeID"];
      result = await setInterfaceBridgePort(submitData);
    } else {
      delete submitData.id;
      result = await addInterfaceBridgePort(submitData);
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
      <template #formSlot_1>
        <a-select
          ref="select"
          :value="formData.devPort"
          :style="{ width: '100%' }"
          :options="devOptions"
          @change="devPortChange($event, 'devPort')"
        >
        </a-select>
      </template>
    </CommonForm>
  </a-modal>
</template>

<style scoped></style>
