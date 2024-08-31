<script setup lang="ts">
import { addToPopDev } from "@/api/cpe/cpeDev.ts";
import CpeAtPopTable from "./components/cpe-at-pop-table.vue";
import { Form } from "ant-design-vue";
import _ from "lodash";
import emitter from "~@/utils/eventbus";

const props = defineProps({
  cpeId: {
    type: Number,
    required: true,
  },
  collapseKey: {
    type: Array as PropType<string[]>,
    required: true,
  },
});

const emits = defineEmits(["update:collapseKey"]);

const activeKey = computed({
  get: () => props.collapseKey,
  set: (val) => emits("update:collapseKey", val),
});

const confirmLoading = ref(false);
const formRef = ref<any>(null);

const rules = {
  popDevIds: [{ required: true, message: "POP设备不能为空", trigger: "blur" }],
};
const initValues = reactive<Record<string, any>>({
  cpeDevId: props.cpeId, // *
  popDev: [],
  popDevIds: [], // *
});
const formData = ref(initValues);
const { resetFields } = Form.useForm(formData);
const collapsible = ref<"header" | "disabled">("header");

// 确认提交表单数据
const clickConfirm = async () => {
  try {
    await formRef.value.validateFields();
    let submitData = _.cloneDeep(formData.value);

    let result;
    confirmLoading.value = true;
    delete submitData.popDev;
    result = await addToPopDev(submitData);

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
  activeKey.value = [""];
  emitter.emit("refreshTableData", ["cpeAtPop"]);
};
defineExpose({ clickCancel });
</script>

<template>
  <div class="descriptions">
    <CpeAtPopTable :cpeId="props.cpeId" />
  </div>
  <a-divider />
  <div class="formBox">
    <a-collapse
      v-model:activeKey="activeKey"
      :collapsible="collapsible"
      :destroyInactivePanel="true"
    >
      <a-collapse-panel key="1" header="添加到POP设备">
        <a-form ref="formRef" layout="horizontal" :model="formData">
          <a-form-item
            label="添加到POP设备"
            name="popDevIds"
            :rules="rules.popDevIds"
          >
            <MTableCheckbox
              v-model="formData"
              :parameters="{
                describe: 'POP设备列表',
                nameValue: 'name',
                name: 'popDev',
                ids: 'popDevIds',
                path: '../../pages/device-management/pop-dev/index.vue',
              }"
            ></MTableCheckbox>
          </a-form-item>
          <a-form-item>
            <div class="dialog-footer">
              <a-button @click="clickCancel">取消</a-button>
              <a-button
                type="primary"
                @click="clickConfirm"
                :loading="confirmLoading"
                >提交</a-button
              >
            </div>
          </a-form-item>
        </a-form>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<style lang="scss" scoped>
.descriptions {
  padding: 12px 50px;
}
.formBox {
  padding: 12px 50px;
  .dialog-footer {
    text-align: right;
    .ant-btn-primary {
      margin-left: 10px;
    }
  }
}
</style>
