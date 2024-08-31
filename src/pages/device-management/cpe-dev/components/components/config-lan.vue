<script setup lang="ts">
import { confLan } from "@/api/cpe/cpeDev.ts";
import { getInterfaceList } from "@/api/device/devApi";
import DhcpClientTable from "./components/dhcp-client-table.vue";
import IpAddressTable from "./components/ip-address-table.vue";
import IpRouteTable from "./components/ip-route-table.vue";
import DhcpServerTable from "./components/dhcp-server-table.vue";
import { Form } from "ant-design-vue";
import emitter from "@/utils/eventbus";
import _ from "lodash";

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
const lanStaticAddIpAddressRef = ref<any>(null);
const lanStaticAddIpRouteRef = ref<any>(null);
const lanStaticAddIpDhcpServerRef = ref<any>(null);
const lanStaticAddIpDhcpServerRefIpPool = ref<any>(null);

const initValues = reactive<any>({
  addIpDhcpClient: {
    configBelong: "Lan",
    cpeDevID: props.cpeId,
    defaultRouteDistance: "",
    devPort: undefined,
    disabled: "no",
    skipControlerAndDevConsistencyCheck: "no",
  },
  confType: "dhcp",
  cpeDevId: props.cpeId,
  lanStatic: {
    addIpDhcpServer: {
      comment: "",
      cpeDevID: props.cpeId,
      devPort: undefined,
      disabled: "no",
      ipPool: {
        addLanDhcpExcludedIp: [
          {
            start: "",
            end: "",
          },
        ],
        cpeDevID: props.cpeId,
        comment: "",
        skipControlerAndDevConsistencyCheck: "no",
      },
      leaseTime: "",
      skipControlerAndDevConsistencyCheck: "no",
    },
    addIpAddress: {
      address: "",
      comment: "",
      configBelong: "Lan",
      devPort: undefined,
      cpeDevID: props.cpeId,
      disabled: "no",
      skipControlerAndDevConsistencyCheck: "no",
    },
    addIpRoute: {
      comment: "",
      configBelong: "Lan",
      cpeDevID: props.cpeId,
      disabled: "no",
      distance: "",
      dstAddress: "",
      gateway: "",
      skipControlerAndDevConsistencyCheck: "no",
    },
  },
});
const formData = ref(initValues);
const { resetFields } = Form.useForm(formData);
const collapsible = ref<"header" | "disabled">("header");

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

const devOptions = ref<any>([]);
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

// 切换Lan类型
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
  if (key_2 === "ipPool") {
    if (checked) {
      formData.value["lanStatic"]["addIpDhcpServer"]["ipPool"][name] = "yes";
    } else {
      formData.value["lanStatic"]["addIpDhcpServer"]["ipPool"][name] = "no";
    }
  } else {
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
  }
};

// 三层结构内输入框复用函数
const inputChangeFn = (
  event: any,
  name: string,
  key_1: string,
  key_2?: string
) => {
  const value = event.target.value;
  if (key_2) {
    if (key_2 === "ipPool") {
      if (name === "comment") {
        formData.value["lanStatic"]["addIpDhcpServer"]["ipPool"]["comment"] =
          value;
      }
    } else {
      formData.value[key_1][key_2][name] = value;
    }
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

// DHCP服务器中ip地址池排除IP
const removeExcludedIp = (index: number) => {
  if (index > 0)
    formData.value["lanStatic"]["addIpDhcpServer"]["ipPool"][
      "addLanDhcpExcludedIp"
    ].splice(index, 1);
};
const addExcludedIp = () => {
  formData.value["lanStatic"]["addIpDhcpServer"]["ipPool"][
    "addLanDhcpExcludedIp"
  ].push({
    start: "",
    end: "",
  });
};
const excludedIpStartInputFn = (event: any, index: number) => {
  formData.value["lanStatic"]["addIpDhcpServer"]["ipPool"][
    "addLanDhcpExcludedIp"
  ][index]["start"] = event.target.value;
};
const excludedIpEndInputFn = (event: any, index: number) => {
  formData.value["lanStatic"]["addIpDhcpServer"]["ipPool"][
    "addLanDhcpExcludedIp"
  ][index]["end"] = event.target.value;
};

// 确认提交表单数据
const clickConfirm = async () => {
  try {
    await formRef.value.validateFields();
    let submitData = _.cloneDeep(formData.value);
    if (submitData.confType === "dhcp") {
      await addIpDhcpClientRef.value.validateFields();
      delete submitData.lanStatic;
      if (
        submitData.addIpDhcpClient.skipControlerAndDevConsistencyCheck === "no"
      ) {
        delete submitData.addIpDhcpClient.skipControlerAndDevConsistencyCheck;
      }
    } else {
      await lanStaticAddIpAddressRef.value.validateFields();
      await lanStaticAddIpRouteRef.value.validateFields();
      delete submitData.addIpDhcpClient;
      // 静态IP地址
      if (
        submitData.lanStatic.addIpAddress
          .skipControlerAndDevConsistencyCheck === "no"
      ) {
        delete submitData.lanStatic.addIpAddress
          .skipControlerAndDevConsistencyCheck;
      }
      // 静态路由
      if (submitData.lanStatic.addIpRoute.distance) {
        submitData.lanStatic.addIpRoute.distance =
          submitData.lanStatic.addIpRoute.distance.toString();
      }
      if (submitData.lanStatic.addIpRoute.distance === "") {
        delete submitData.lanStatic.addIpRoute.distance;
      }
      if (
        submitData.lanStatic.addIpRoute.skipControlerAndDevConsistencyCheck ===
        "no"
      ) {
        delete submitData.lanStatic.addIpRoute
          .skipControlerAndDevConsistencyCheck;
      }
      // DHCP服务器
      if (
        submitData.lanStatic.addIpDhcpServer.ipPool.addLanDhcpExcludedIp
          .start ||
        submitData.lanStatic.addIpDhcpServer.ipPool.addLanDhcpExcludedIp.end ||
        submitData.lanStatic.addIpDhcpServer.ipPool.comment ||
        submitData.lanStatic.addIpDhcpServer.devPort ||
        submitData.lanStatic.addIpDhcpServer.ipPool.leaseTime
      ) {
        await lanStaticAddIpDhcpServerRef.value.validateFields();
        await lanStaticAddIpDhcpServerRefIpPool.value.validateFields();
        if (
          submitData.lanStatic.addIpDhcpServer
            .skipControlerAndDevConsistencyCheck === "no"
        ) {
          delete submitData.lanStatic.addIpDhcpServer
            .skipControlerAndDevConsistencyCheck;
        }
        if (
          submitData.lanStatic.addIpDhcpServer.ipPool
            .skipControlerAndDevConsistencyCheck === "no"
        ) {
          delete submitData.lanStatic.addIpDhcpServer.ipPool
            .skipControlerAndDevConsistencyCheck;
        }
      } else {
        delete submitData.lanStatic.addIpDhcpServer;
      }
    }
    console.log("submitData", submitData);

    let result;
    confirmLoading.value = true;

    result = await confLan(submitData);

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
    "dhcpServer",
    "ipAddress",
    "ipRoute",
  ]);
};
defineExpose({ clickCancel });
</script>

<template>
  <div class="descriptions">
    <a-tabs v-model:activeKey="tableActiveKey" :tab-position="'left'" animated>
      <a-tab-pane key="dhcpClient" tab="DHCP客户端"
        ><DhcpClientTable :cpeId="props.cpeId" :configBelong="'Lan'"
      /></a-tab-pane>
      <a-tab-pane key="dhcpServer" tab="DHCP服务器"
        ><DhcpServerTable :cpeId="props.cpeId"
      /></a-tab-pane>
      <a-tab-pane key="ipAddress" tab="静态IP地址"
        ><IpAddressTable :cpeId="props.cpeId" :configBelong="'Lan'"
      /></a-tab-pane>
      <a-tab-pane key="ipRoute" tab="静态路由"
        ><IpRouteTable :cpeId="props.cpeId" :configBelong="'Lan'"
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
      <a-collapse-panel key="1" header="配置LAN口">
        <a-form
          name="lan"
          ref="formRef"
          layout="horizontal"
          :model="formData"
          :labelCol="{ span: 4 }"
          :style="{ paddingTop: '20px' }"
        >
          <a-form-item
            label="LAN类型"
            name="confType"
            :rules="[
              { required: true, message: 'LAN类型不能为空', trigger: 'blur' },
            ]"
          >
            <a-radio-group
              v-model:value="formData.confType"
              :style="{ marginBottom: '8px' }"
              @change="changeRadioFn"
            >
              <a-radio-button value="dhcp">DHCP</a-radio-button>
              <a-radio-button value="static">静态</a-radio-button>
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
              ref="lanStaticAddIpAddressRef"
              layout="horizontal"
              :model="formData.lanStatic.addIpAddress"
              :labelCol="{ span: 4 }"
            >
              <a-form-item name="disabled" label="配置状态是否禁用">
                <a-switch
                  :checked="
                    formData.lanStatic?.addIpAddress?.disabled === 'yes'
                      ? true
                      : false
                  "
                  @change="
                    changeSwitchFn(
                      $event,
                      'disabled',
                      'lanStatic',
                      'addIpAddress'
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
                    formData.lanStatic?.addIpAddress
                      ?.skipControlerAndDevConsistencyCheck === 'yes'
                      ? true
                      : false
                  "
                  @change="
                    changeSwitchFn(
                      $event,
                      'skipControlerAndDevConsistencyCheck',
                      'lanStatic',
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
                  :value="formData.lanStatic?.addIpAddress?.address"
                  @change="
                    inputChangeFn(
                      $event,
                      'address',
                      'lanStatic',
                      'addIpAddress'
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
                  :value="formData.lanStatic?.addIpAddress?.devPort"
                  :style="{ width: '50%' }"
                  :options="devOptions"
                  @change="
                    devPortChange(
                      $event,
                      'devPort',
                      'lanStatic',
                      'addIpAddress'
                    )
                  "
                >
                </a-select>
              </a-form-item>

              <a-form-item label="备注" name="comment">
                <a-input
                  style="width: 50%"
                  placeholder="请输入备注"
                  :value="formData.lanStatic?.addIpAddress?.comment"
                  @change="
                    inputChangeFn(
                      $event,
                      'comment',
                      'lanStatic',
                      'addIpAddress'
                    )
                  "
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
              ref="lanStaticAddIpRouteRef"
              layout="horizontal"
              :model="formData.lanStatic.addIpRoute"
              :labelCol="{ span: 4 }"
            >
              <a-form-item name="disabled" label="配置状态是否禁用">
                <a-switch
                  :checked="
                    formData.lanStatic?.addIpRoute?.disabled === 'yes'
                      ? true
                      : false
                  "
                  @change="
                    changeSwitchFn(
                      $event,
                      'disabled',
                      'lanStatic',
                      'addIpRoute'
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
                    formData.lanStatic?.addIpRoute
                      ?.skipControlerAndDevConsistencyCheck === 'yes'
                      ? true
                      : false
                  "
                  @change="
                    changeSwitchFn(
                      $event,
                      'skipControlerAndDevConsistencyCheck',
                      'lanStatic',
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
                  :value="formData.lanStatic?.addIpRoute?.gateway"
                  @change="
                    inputChangeFn($event, 'gateway', 'lanStatic', 'addIpRoute')
                  "
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
                  :value="formData.lanStatic?.addIpRoute?.dstAddress"
                  @change="
                    inputChangeFn(
                      $event,
                      'dstAddress',
                      'lanStatic',
                      'addIpRoute'
                    )
                  "
                />
              </a-form-item>
              <a-form-item label="管理距离" name="distance">
                <a-input-number
                  style="width: 50%"
                  :value="formData.lanStatic?.addIpRoute?.distance"
                  @change="
                    inputNumberChangeFn(
                      $event,
                      'distance',
                      'lanStatic',
                      'addIpRoute'
                    )
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
                  :value="formData.lanStatic?.addIpRoute?.comment"
                  @change="
                    inputChangeFn($event, 'comment', 'lanStatic', 'addIpRoute')
                  "
                />
              </a-form-item>
            </a-form>

            <!------ DHCP服务器 ------>
            <a-form-item name="addIpDhcpServer" :colon="false">
              <template #label>
                <a-tag style="font-size: 14px" color="blue">DHCP服务器</a-tag>
                <span>(选填)</span>
              </template>
            </a-form-item>
            <a-form
              name="dhcpServer"
              ref="lanStaticAddIpDhcpServerRef"
              layout="horizontal"
              :model="formData.lanStatic.addIpDhcpServer"
              :labelCol="{ span: 4 }"
            >
              <a-form-item name="disabled" label="配置状态是否禁用">
                <a-switch
                  :checked="
                    formData.lanStatic?.addIpDhcpServer?.disabled === 'yes'
                      ? true
                      : false
                  "
                  @change="
                    changeSwitchFn(
                      $event,
                      'disabled',
                      'lanStatic',
                      'addIpDhcpServer'
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
                    formData.lanStatic?.addIpDhcpServer
                      ?.skipControlerAndDevConsistencyCheck === 'yes'
                      ? true
                      : false
                  "
                  @change="
                    changeSwitchFn(
                      $event,
                      'skipControlerAndDevConsistencyCheck',
                      'lanStatic',
                      'addIpDhcpServer'
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
                  :value="formData.lanStatic?.addIpDhcpServer?.devPort"
                  :style="{ width: '50%' }"
                  :options="devOptions"
                  @change="
                    devPortChange(
                      $event,
                      'devPort',
                      'lanStatic',
                      'addIpDhcpServer'
                    )
                  "
                >
                </a-select>
              </a-form-item>

              <a-form-item label="IP地址池" name="ipPool">
                <a-form
                  name="ipPool"
                  ref="lanStaticAddIpDhcpServerRefIpPool"
                  layout="horizontal"
                  :model="formData.lanStatic.addIpDhcpServer.ipPool"
                  :labelCol="{ span: 4 }"
                  style="width: 50%"
                >
                  <div
                    v-for="(item, index) in formData.lanStatic.addIpDhcpServer
                      .ipPool.addLanDhcpExcludedIp"
                    :key="index"
                    style="width: 100%; display: flex"
                  >
                    <div style="flex: 1">
                      <a-form-item
                        label="排除的起始IP"
                        :name="['addLanDhcpExcludedIp', index, 'start']"
                        :rules="[
                          {
                            required: true,
                            message: '排除的起始IP不能为空',
                            trigger: 'blur',
                          },
                        ]"
                        :labelCol="{ span: 6 }"
                      >
                        <a-input
                          style="width: 100%"
                          placeholder="排除的起始IP 包含该起始IP"
                          :value="item.start"
                          @change="excludedIpStartInputFn($event, index)"
                        />
                      </a-form-item>
                      <a-form-item
                        label="排除的结束IP"
                        :name="['addLanDhcpExcludedIp', index, 'end']"
                        :labelCol="{ span: 6 }"
                      >
                        <a-input
                          style="width: 100%"
                          placeholder="排除的结束IP 包含该结束IP"
                          :value="item.end"
                          @change="excludedIpEndInputFn($event, index)"
                        />
                      </a-form-item>
                    </div>
                    <div style="width: 52px; display: flex; align-items: start">
                      <MinusCircleOutlined
                        :class="index === 0 ? 'disabled' : 'removeExcludedIp'"
                        @click="removeExcludedIp(index)"
                      />
                      <PlusSquareOutlined
                        v-show="index === 0"
                        class="addExcludedIp"
                        @click="addExcludedIp()"
                      />
                    </div>
                  </div>
                  <a-form-item
                    label="备注"
                    name="comment"
                    :labelCol="{ span: 5 }"
                  >
                    <a-input
                      style="width: 100%"
                      placeholder="请输入备注"
                      :value="
                        formData.lanStatic?.addIpDhcpServer?.ipPool.comment
                      "
                      @change="
                        inputChangeFn($event, 'comment', 'lanStatic', 'ipPool')
                      "
                    />
                  </a-form-item>
                  <a-form-item
                    name="skipControlerAndDevConsistencyCheck"
                    label="是否跳过数据一致性检查"
                    :labelCol="{ span: 8 }"
                  >
                    <a-switch
                      :checked="
                        formData.lanStatic?.addIpDhcpServer?.ipPool
                          .skipControlerAndDevConsistencyCheck === 'yes'
                          ? true
                          : false
                      "
                      @change="
                        changeSwitchFn(
                          $event,
                          'skipControlerAndDevConsistencyCheck',
                          'lanStatic',
                          'ipPool'
                        )
                      "
                    />
                  </a-form-item>
                </a-form>
              </a-form-item>

              <a-form-item
                label="IP地址租用时间"
                name="leaseTime"
                :rules="[
                  {
                    pattern: /^(\d{1,2}d )?[012][01234]:[012345]\d:[012345]\d$/,
                    message: `租用时长格式：10:00:00 或者 10d 10:00:00`,
                    trigger: 'blur',
                  },
                ]"
              >
                <a-input
                  style="width: 50%"
                  placeholder="请输入IP地址租用时间，格式：10:00:00 或者 10d 10:00:00"
                  :value="formData.lanStatic?.addIpDhcpServer?.leaseTime"
                  @change="
                    inputChangeFn(
                      $event,
                      'leaseTime',
                      'lanStatic',
                      'addIpDhcpServer'
                    )
                  "
                />
              </a-form-item>
              <a-form-item label="备注" name="comment">
                <a-input
                  style="width: 50%"
                  placeholder="请输入备注"
                  :value="formData.lanStatic?.addIpDhcpServer?.comment"
                  @change="
                    inputChangeFn(
                      $event,
                      'comment',
                      'lanStatic',
                      'addIpDhcpServer'
                    )
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
