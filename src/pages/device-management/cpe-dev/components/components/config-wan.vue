<script setup lang="ts">
import { confWan } from "@/api/cpe/cpeDev.ts";
import { getInterfaceList } from "@/api/device/devApi";
import DhcpClientTable from "./components/dhcp-client-table.vue";
import IpAddressTable from "./components/ip-address-table.vue";
import IpRouteTable from "./components/ip-route-table.vue";
import InterfacePppoeClient from "./components/interface-pppoe-client-table.vue";
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

const tableActiveKey = ref("dhcpClient");
const confirmLoading = ref(false);
const formRef = ref<any>(null);
const addIpDhcpClientRef = ref<any>(null);
const addIpAddressRef = ref<any>(null);
const addIpRouteRef = ref<any>(null);
const addInterfacePppoeClientRef = ref<any>(null);

const initValues = reactive<any>({
  confType: "dhcp",
  cpeDevId: props.cpeId,
  addIpDhcpClient: {
    configBelong: "Wan",
    cpeDevID: props.cpeId,
    defaultRouteDistance: "",
    devPort: undefined,
    disabled: "no",
    skipControlerAndDevConsistencyCheck: "no",
  },
  addIpAddress: {
    address: "",
    comment: "",
    configBelong: "Wan",
    cpeDevID: props.cpeId,
    devPort: undefined,
    disabled: "no",
    skipControlerAndDevConsistencyCheck: "no",
  },
  addIpRoute: {
    comment: "",
    configBelong: "Wan",
    cpeDevID: props.cpeId,
    disabled: "no",
    distance: "",
    dstAddress: "",
    gateway: "",
    skipControlerAndDevConsistencyCheck: "no",
  },
  addInterfacePppoeClient: {
    addDefaultRoute: "no",
    comment: "",
    configBelong: "Wan",
    cpeDevID: props.cpeId,
    defaultRouteDistance: "",
    devPort: undefined,
    disabled: "no",
    user: "",
    password: "",
    skipControlerAndDevConsistencyCheck: "no",
  },
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

const devPortChange = (
  value: any,
  name: string,
  key_1: string,
  key_2?: string
) => {
  if (key_2) {
    formData.value[key_1][key_2][name] = value;
  } else {
    formData.value[key_1][name] = value;
  }
};

// 切换Wan类型
const changeRadioFn = (event: any) => {
  resetFields();
  const value = event.target.value;
  formData.value.confType = value;
};

// 切换开关状态
const changeSwitchFn = (
  checked: boolean | string | number,
  name: string,
  key_1: string,
  key_2?: string
) => {
  if (checked) {
    if (key_2) {
      formData.value[key_1][key_2][name] = "yes";
    } else {
      formData.value[key_1][name] = "yes";
    }
  } else {
    if (key_2) {
      formData.value[key_1][key_2][name] = "no";
    } else {
      formData.value[key_1][name] = "no";
    }
  }
};

// 两层结构内输入框复用函数
const inputChangeFn = (
  event: any,
  name: string,
  key_1: string,
  key_2?: string
) => {
  const value = event.target.value;
  if (key_2) {
    formData.value[key_1][key_2][name] = value;
  } else {
    formData.value[key_1][name] = value;
  }
};
// 两层结构内数字输入框复用函数
const inputNumberChangeFn = (
  value: any,
  name: string,
  key_1: string,
  key_2?: string
) => {
  if (key_2) {
    formData.value[key_1][key_2][name] = value;
  } else {
    formData.value[key_1][name] = value;
  }
};

// 确认提交表单数据
const clickConfirm = async () => {
  try {
    await formRef.value.validateFields();
    let submitData = _.cloneDeep(formData.value);
    if (submitData.confType === "dhcp") {
      await addIpDhcpClientRef.value.validateFields();
      delete submitData.addIpAddress;
      delete submitData.addIpRoute;
      delete submitData.addInterfacePppoeClient;
      if (
        submitData.addIpDhcpClient.skipControlerAndDevConsistencyCheck === "no"
      ) {
        delete submitData.addIpDhcpClient.skipControlerAndDevConsistencyCheck;
      }
    } else if (submitData.confType === "static") {
      await addIpAddressRef.value.validateFields();
      await addIpRouteRef.value.validateFields();
      delete submitData.addIpDhcpClient;
      delete submitData.addInterfacePppoeClient;
      // 静态IP地址
      if (
        submitData.addIpAddress.skipControlerAndDevConsistencyCheck === "no"
      ) {
        delete submitData.addIpAddress.skipControlerAndDevConsistencyCheck;
      }
      // 静态路由
      if (submitData.addIpRoute.distance) {
        submitData.addIpRoute.distance =
          submitData.addIpRoute.distance.toString();
      }
      if (submitData.addIpRoute.distance === "") {
        delete submitData.addIpRoute.distance;
      }
      if (submitData.addIpRoute.skipControlerAndDevConsistencyCheck === "no") {
        delete submitData.addIpRoute.skipControlerAndDevConsistencyCheck;
      }
    } else if (submitData.confType === "pppoe") {
      await addInterfacePppoeClientRef.value.validateFields();
      delete submitData.addIpDhcpClient;
      delete submitData.addIpAddress;
      delete submitData.addIpRoute;
      if (
        submitData.addInterfacePppoeClient
          .skipControlerAndDevConsistencyCheck === "no"
      ) {
        delete submitData.addInterfacePppoeClient
          .skipControlerAndDevConsistencyCheck;
      }
    }
    console.log("submitData", submitData);

    let result;
    confirmLoading.value = true;

    result = await confWan(submitData);

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
  tableActiveKey.value = "dhcpClient";
  emitter.emit("refreshTableData", [
    "dhcpClient",
    "ipAddress",
    "ipRoute",
    "interfacePppoeClient",
  ]);
};
defineExpose({ clickCancel });
</script>

<template>
  <div class="descriptions">
    <a-tabs v-model:activeKey="tableActiveKey" :tab-position="'left'" animated>
      <a-tab-pane key="dhcpClient" tab="DHCP客户端"
        ><DhcpClientTable :cpeId="props.cpeId" :configBelong="'Wan'"
      /></a-tab-pane>
      <a-tab-pane key="ipAddress" tab="静态IP地址"
        ><IpAddressTable :cpeId="props.cpeId" :configBelong="'Wan'"
      /></a-tab-pane>
      <a-tab-pane key="ipRoute" tab="静态路由"
        ><IpRouteTable :cpeId="props.cpeId" :configBelong="'Wan'"
      /></a-tab-pane>
      <a-tab-pane key="interfacePppoeClient" tab="PPPOE客户端"
        ><InterfacePppoeClient :cpeId="props.cpeId" :configBelong="'Wan'"
      /></a-tab-pane>
    </a-tabs>
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
            label="WAN类型"
            name="confType"
            :rules="[
              { required: true, message: 'WAN类型不能为空', trigger: 'blur' },
            ]"
          >
            <a-radio-group
              v-model:value="formData.confType"
              :style="{ marginBottom: '8px' }"
              @change="changeRadioFn"
            >
              <a-radio-button value="dhcp">DHCP</a-radio-button>
              <a-radio-button value="static">静态</a-radio-button>
              <a-radio-button value="pppoe">PPPOE</a-radio-button>
            </a-radio-group>
          </a-form-item>

          <!-------------- DHCP客户端 -------------->
          <template v-if="formData.confType === 'dhcp'">
            <a-form
              name="dhcp"
              ref="addIpDhcpClientRef"
              layout="horizontal"
              :model="formData.addIpDhcpClient"
              :labelCol="{ span: 4 }"
            >
              <a-form-item name="disabled" label="配置状态是否禁用">
                <a-switch
                  :checked="
                    formData.addIpDhcpClient?.disabled === 'yes' ? true : false
                  "
                  @change="
                    changeSwitchFn($event, 'disabled', 'addIpDhcpClient')
                  "
                />
              </a-form-item>
              <a-form-item
                name="skipControlerAndDevConsistencyCheck"
                label="是否跳过数据一致性检查"
              >
                <a-switch
                  :checked="
                    formData.addIpDhcpClient
                      ?.skipControlerAndDevConsistencyCheck === 'yes'
                      ? true
                      : false
                  "
                  @change="
                    changeSwitchFn(
                      $event,
                      'skipControlerAndDevConsistencyCheck',
                      'addIpDhcpClient'
                    )
                  "
                />
              </a-form-item>
              <a-form-item
                label="设备接口"
                name="devPort"
                :rules="[
                  {
                    required: true,
                    message: '设备接口不能为空',
                    trigger: 'blur',
                  },
                  { max: 64, message: '设备接口长度不能超过64位' },
                ]"
              >
                <a-select
                  ref="select"
                  :value="formData.addIpDhcpClient?.devPort"
                  :style="{ width: '50%' }"
                  :options="devOptions"
                  @change="devPortChange($event, 'devPort', 'addIpDhcpClient')"
                >
                </a-select>
              </a-form-item>
              <a-form-item
                name="defaultRouteDistance"
                label="管理默认距离"
                :rules="[{ max: 64, message: '管理默认距离长度不能超过6位' }]"
              >
                <a-input
                  style="width: 50%"
                  placeholder="请输入管理默认距离"
                  :value="formData.addIpDhcpClient?.defaultRouteDistance"
                  @change="
                    inputChangeFn(
                      $event,
                      'defaultRouteDistance',
                      'addIpDhcpClient'
                    )
                  "
                  :controls="false"
                />
              </a-form-item>
            </a-form>
          </template>

          <!------------------ 静态 ------------------>
          <template v-else-if="formData.confType === 'static'">
            <!------ 静态IP地址 ------>
            <a-form-item name="addIpAddress" :colon="false">
              <template #label>
                <a-tag style="font-size: 14px" color="blue">静态IP地址</a-tag>
              </template>
            </a-form-item>
            <a-form
              name="ipAddress"
              ref="addIpAddressRef"
              layout="horizontal"
              :model="formData.addIpAddress"
              :labelCol="{ span: 4 }"
            >
              <a-form-item name="disabled" label="配置状态是否禁用">
                <a-switch
                  :checked="
                    formData.addIpAddress?.disabled === 'yes' ? true : false
                  "
                  @change="changeSwitchFn($event, 'disabled', 'addIpAddress')"
                />
              </a-form-item>
              <a-form-item
                name="skipControlerAndDevConsistencyCheck"
                label="是否跳过数据一致性检查"
              >
                <a-switch
                  :checked="
                    formData.addIpAddress
                      ?.skipControlerAndDevConsistencyCheck === 'yes'
                      ? true
                      : false
                  "
                  @change="
                    changeSwitchFn(
                      $event,
                      'skipControlerAndDevConsistencyCheck',
                      'addIpAddress'
                    )
                  "
                />
              </a-form-item>
              <a-form-item
                label="IP地址"
                name="address"
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
                  placeholder="请输入IP地址，如192.168.1.1/24"
                  :value="formData.addIpAddress?.address"
                  @change="inputChangeFn($event, 'address', 'addIpAddress')"
                />
              </a-form-item>
              <a-form-item
                label="设备接口"
                name="devPort"
                :rules="[
                  {
                    required: true,
                    message: '设备接口不能为空',
                    trigger: 'blur',
                  },
                  { max: 64, message: '设备接口长度不能超过64位' },
                ]"
              >
                <a-select
                  ref="select"
                  :value="formData.addIpAddress?.devPort"
                  :style="{ width: '50%' }"
                  :options="devOptions"
                  @change="devPortChange($event, 'devPort', 'addIpAddress')"
                >
                </a-select>
              </a-form-item>

              <a-form-item label="备注" name="comment">
                <a-input
                  style="width: 50%"
                  placeholder="请输入备注"
                  :value="formData.addIpAddress?.comment"
                  @change="inputChangeFn($event, 'comment', 'addIpAddress')"
                />
              </a-form-item>
            </a-form>

            <!------ 静态路由 ------>
            <a-form-item name="addIpRoute" :colon="false">
              <template #label>
                <a-tag style="font-size: 14px" color="blue">静态路由</a-tag>
              </template>
            </a-form-item>
            <a-form
              name="ipRoute"
              ref="addIpRouteRef"
              layout="horizontal"
              :model="formData.addIpRoute"
              :labelCol="{ span: 4 }"
            >
              <a-form-item name="disabled" label="配置状态是否禁用">
                <a-switch
                  :checked="
                    formData.addIpRoute?.disabled === 'yes' ? true : false
                  "
                  @change="changeSwitchFn($event, 'disabled', 'addIpRoute')"
                />
              </a-form-item>
              <a-form-item
                name="skipControlerAndDevConsistencyCheck"
                label="是否跳过数据一致性检查"
              >
                <a-switch
                  :checked="
                    formData.addIpRoute?.skipControlerAndDevConsistencyCheck ===
                    'yes'
                      ? true
                      : false
                  "
                  @change="
                    changeSwitchFn(
                      $event,
                      'skipControlerAndDevConsistencyCheck',
                      'addIpRoute'
                    )
                  "
                />
              </a-form-item>
              <a-form-item
                label="网关"
                name="gateway"
                :rules="[
                  {
                    required: true,
                    message: '网关不能为空',
                    trigger: 'blur',
                  },
                ]"
              >
                <a-input
                  style="width: 50%"
                  placeholder="请输入网关，例如：192.168.1.1"
                  :value="formData.addIpRoute?.gateway"
                  @change="inputChangeFn($event, 'gateway', 'addIpRoute')"
                />
              </a-form-item>
              <a-form-item
                label="目标地址"
                name="dstAddress"
                :rules="[
                  {
                    required: true,
                    message: '目标地址不能为空',
                    trigger: 'blur',
                  },
                ]"
              >
                <a-input
                  style="width: 50%"
                  placeholder="请输入目标地址，如192.168.1.1/24"
                  :value="formData.addIpRoute?.dstAddress"
                  @change="inputChangeFn($event, 'dstAddress', 'addIpRoute')"
                />
              </a-form-item>
              <a-form-item label="管理距离" name="distance">
                <a-input-number
                  style="width: 50%"
                  :value="formData.addIpRoute?.distance"
                  @change="
                    inputNumberChangeFn($event, 'distance', 'addIpRoute')
                  "
                  :min="0"
                  :max="65535"
                  :controls="false"
                />
              </a-form-item>
              <a-form-item label="备注" name="comment">
                <a-input
                  style="width: 50%"
                  placeholder="请输入备注"
                  :value="formData.addIpRoute?.comment"
                  @change="inputChangeFn($event, 'comment', 'addIpRoute')"
                />
              </a-form-item>
            </a-form>
          </template>

          <!------------------ PPPOE ------------------>
          <template v-else-if="formData.confType === 'pppoe'">
            <a-form
              name="pppoe"
              ref="addInterfacePppoeClientRef"
              layout="horizontal"
              :model="formData.addInterfacePppoeClient"
              :labelCol="{ span: 4 }"
            >
              <a-form-item name="addDefaultRoute" label="是否添加路由">
                <a-switch
                  :checked="
                    formData.addInterfacePppoeClient?.addDefaultRoute === 'yes'
                      ? true
                      : false
                  "
                  @change="
                    changeSwitchFn(
                      $event,
                      'addDefaultRoute',
                      'addInterfacePppoeClient'
                    )
                  "
                />
              </a-form-item>
              <a-form-item name="disabled" label="配置状态是否禁用">
                <a-switch
                  :checked="
                    formData.addInterfacePppoeClient?.disabled === 'yes'
                      ? true
                      : false
                  "
                  @change="
                    changeSwitchFn(
                      $event,
                      'disabled',
                      'addInterfacePppoeClient'
                    )
                  "
                />
              </a-form-item>
              <a-form-item
                name="skipControlerAndDevConsistencyCheck"
                label="是否跳过数据一致性检查"
              >
                <a-switch
                  :checked="
                    formData.addInterfacePppoeClient
                      ?.skipControlerAndDevConsistencyCheck === 'yes'
                      ? true
                      : false
                  "
                  @change="
                    changeSwitchFn(
                      $event,
                      'skipControlerAndDevConsistencyCheck',
                      'addInterfacePppoeClient'
                    )
                  "
                />
              </a-form-item>
              <a-form-item
                label="设备接口"
                name="devPort"
                :rules="[
                  {
                    required: true,
                    message: '设备接口不能为空',
                    trigger: 'blur',
                  },
                  { max: 64, message: '设备接口长度不能超过64位' },
                ]"
              >
                <a-select
                  ref="select"
                  :value="formData.addInterfacePppoeClient?.devPort"
                  :style="{ width: '50%' }"
                  :options="devOptions"
                  @change="
                    devPortChange($event, 'devPort', 'addInterfacePppoeClient')
                  "
                >
                </a-select>
              </a-form-item>
              <a-form-item
                label="账号"
                name="user"
                :rules="[
                  {
                    required: true,
                    message: '账号不能为空',
                    trigger: 'blur',
                  },
                ]"
              >
                <a-input
                  style="width: 50%"
                  placeholder="请输入账号"
                  :value="formData.addInterfacePppoeClient?.user"
                  @change="
                    inputChangeFn($event, 'user', 'addInterfacePppoeClient')
                  "
                />
              </a-form-item>
              <a-form-item
                label="密码"
                name="password"
                :rules="[
                  {
                    required: true,
                    message: '密码不能为空',
                    trigger: 'blur',
                  },
                ]"
              >
                <a-input-password
                  style="width: 50%"
                  placeholder="请输入密码"
                  :value="formData.addInterfacePppoeClient?.password"
                  @change="
                    inputChangeFn($event, 'password', 'addInterfacePppoeClient')
                  "
                />
              </a-form-item>
              <a-form-item
                name="defaultRouteDistance"
                label="管理默认距离"
                :rules="[{ max: 64, message: '管理默认距离长度不能超过6位' }]"
              >
                <a-input
                  style="width: 50%"
                  placeholder="请输入管理默认距离"
                  :value="
                    formData.addInterfacePppoeClient?.defaultRouteDistance
                  "
                  @change="
                    inputChangeFn(
                      $event,
                      'defaultRouteDistance',
                      'addInterfacePppoeClient'
                    )
                  "
                  :controls="false"
                />
              </a-form-item>
              <a-form-item label="备注" name="comment">
                <a-input
                  style="width: 50%"
                  placeholder="请输入备注"
                  :value="formData.addInterfacePppoeClient?.comment"
                  @change="
                    inputChangeFn($event, 'comment', 'addInterfacePppoeClient')
                  "
                />
              </a-form-item>
            </a-form>
          </template>

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
  padding: 12px 50px 12px 25px;
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
