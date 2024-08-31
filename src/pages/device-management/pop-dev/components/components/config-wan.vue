<script setup lang="ts">
import { addPopWan } from "@/api/pop/popDev";
import { getInterfaceList } from "@/api/device/devApi";
import WanTable from "./components/wan-table.vue";
import { Form } from "ant-design-vue";
import emitter from "~@/utils/eventbus";
import _ from "lodash";

const props = defineProps({
  popId: {
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

const initValues = reactive<any>({
  ip: "",
  kind: "", // 传输网络类型
  popDevID: props.popId,
  port: "", // 设备wan端口
  priority: undefined, // 优先级
  domainName: "", // 域名
  skipControlerAndDevConsistencyCheck: "no",
});
const formData = ref(initValues);
const { resetFields } = Form.useForm(formData);
const collapsible = ref<"header" | "disabled">("header");

onMounted(() => {
  getDevOptions();
});
const devOptions = ref<any>([]);
// 获取设备接口列表
const getDevOptions = async () => {
  const res = await getInterfaceList({
    devID: props.popId,
    devType: "pop",
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

// 切换开关状态
const changeSwitchFn = (checked: boolean | string | number, name: string) => {
  if (checked) {
    formData.value[name] = "yes";
  } else {
    formData.value[name] = "no";
  }
};

// 确认提交表单数据
const clickConfirm = async () => {
  try {
    await formRef.value.validateFields();
    let submitData = _.cloneDeep(formData.value);
    console.log("submitData", submitData);
    if (submitData.skipControlerAndDevConsistencyCheck === "no") {
      delete submitData.skipControlerAndDevConsistencyCheck;
    }
    let result;
    confirmLoading.value = true;
    result = await addPopWan(submitData);

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
  emitter.emit("refreshTableData", ["popWan"]);
};
defineExpose({ clickCancel });
</script>

<template>
  <div class="descriptions">
    <WanTable :popId="props.popId" />
  </div>
  <a-divider />
  <div class="formBox">
    <a-collapse
      v-model:activeKey="activeKey"
      :collapsible="collapsible"
      :destroyInactivePanel="true"
    >
      <a-collapse-panel key="1" header="配置WAN口">
        <a-form
          name="wan"
          ref="formRef"
          layout="horizontal"
          :model="formData"
          :labelCol="{ span: 4 }"
          :style="{ paddingTop: '20px' }"
        >
          <a-form-item
            name="ip"
            label="IP地址"
            :rules="[
              {
                required: true,
                message: 'IP地址不能为空',
                trigger: 'blur',
              },
            ]"
          >
            <a-input
              style="width: 50%"
              placeholder="请输入IP地址"
              v-model:value="formData.ip"
            />
          </a-form-item>
          <a-form-item
            name="domainName"
            label="域名"
            :rules="[
              {
                required: true,
                message: '域名不能为空',
                trigger: 'blur',
              },
            ]"
          >
            <a-input
              style="width: 50%"
              placeholder="请输入IP地址"
              v-model:value="formData.domainName"
            />
          </a-form-item>
          <a-form-item
            name="kind"
            label="传输网络类型"
            :rules="[
              {
                required: true,
                message: '传输网络类型不能为空',
                trigger: 'blur',
              },
            ]"
          >
            <a-input
              style="width: 50%"
              placeholder="请输入传输网络类型"
              v-model:value="formData.kind"
            />
          </a-form-item>

          <a-form-item
            name="port"
            label="设备wan端口"
            :rules="[
              {
                required: true,
                message: '设备wan端口不能为空',
                trigger: 'blur',
              },
            ]"
          >
            <a-select
              ref="select"
              :value="formData.port"
              :style="{ width: '50%' }"
              :options="devOptions"
              @change="devPortChange($event, 'port')"
            >
            </a-select>
          </a-form-item>
          <a-form-item label="优先级" name="priority">
            <a-input-number
              style="width: 50%"
              v-model:value="formData.priority"
              :min="0"
              :max="65535"
              :controls="false"
            />
          </a-form-item>
          <a-form-item
            name="skipControlerAndDevConsistencyCheck"
            label="是否跳过数据一致性检查"
          >
            <a-switch
              :checked="
                formData.skipControlerAndDevConsistencyCheck === 'yes'
                  ? true
                  : false
              "
              @change="
                changeSwitchFn($event, 'skipControlerAndDevConsistencyCheck')
              "
            />
          </a-form-item>

          <!-------------- 底部按钮 -------------->
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

.removeExcludedIp {
  margin: 6px 6px 0 6px;
  font-size: 18px;
  color: rgb(245 108 108);
  &:hover {
    color: rgb(240, 70, 70);
  }
}
.addExcludedIp {
  margin-top: 6px;
  font-size: 18px;
  color: #1890ff;
  &:hover {
    color: #40a9ff;
    cursor: pointer;
  }
}
.disabled {
  margin: 6px 6px 0 6px;
  font-size: 18px;
  color: rgb(255, 205, 205);
}
</style>
