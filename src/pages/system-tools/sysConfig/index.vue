<script setup lang="ts">
import { getSystemConfig } from "@/api/system-tools/sysConfig";
import EditToken from "./components/edit-token.vue";
import EditEmail from "./components/edit-email.vue";
import EditCaptcha from "./components/edit-captcha.vue";
import EditLimit from "./components/edit-limit.vue";
import EditProviders from "./components/edit-providers.vue";

interface DialogForm {
  editShow: (data: any, name: string, record?: Record<string, any>) => void;
  // 其他属性和方法的类型声明
}
interface DetailsKeys<T> {
  [key: string]: T;
}

const spinning = ref(false);
const tokenDialog = ref<DialogForm | null>(null);
const emailDialog = ref<DialogForm | null>(null);
const captchaDialog = ref<DialogForm | null>(null);
const limitDialog = ref<DialogForm | null>(null);
const providersDialog = ref<DialogForm | null>(null);
const SystemConfigDetails = ref<any>({});
const detailsKeys: DetailsKeys<string> = {
  token: "Token",
  email: "邮箱",
  captcha: "验证",
  "user-login-limit": "用户登录封禁",
  "signing-key": "密钥",
  "expires-time": "过期时间（天）",
  "buffer-time": "缓冲时间（天）",
  issuer: "签发者",
  // to: "To",
  // from: "From",
  host: "SMTP服务器",
  port: "端口",
  "is-ssl": "是否开启SSL认证",
  secret: "密码",
  nickname: "用户名",
  "key-long": "密钥长度（位）",
  "img-width": "图片宽度（px）",
  "img-height": "图片高度（px）",
  dayMaxCount: "每日上限（次）",
  intervalSeconds: "间隔时间（秒）",
  retryCount: "尝试次数（次）",
  "sms-verification": "短信验证",
  providers: "提供商",
};
const detailsShow = reactive<any>({
  token: false,
  email: false,
  captcha: false,
  "user-login-limit": false,
  "sms-verification": false,
});
const columns = [
  {
    title: "提供商",
    key: "providerName",
    dataIndex: "providerName",
  },
  {
    title: "模板ID",
    key: "templateCode",
    dataIndex: "templateCode",
  },
  {
    title: "模板签名",
    key: "templateSignName",
    dataIndex: "templateSignName",
  },
  {
    title: "访问ID",
    dataIndex: "accessID",
    key: "accessID",
  },
  {
    title: "访问密码",
    dataIndex: "accessSecret",
    key: "accessSecret",
  },
  {
    title: "长度",
    key: "length",
    dataIndex: "length",
  },
  {
    title: "有效时间（秒）",
    dataIndex: "effective",
    key: "effective",
  },
  {
    title: "请求间隙（秒）",
    dataIndex: "intervalSeconds",
    key: "intervalSeconds",
  },
  {
    title: "定时清理（秒）",
    dataIndex: "timerCleanSms",
    key: "timerCleanSms",
  },
  {
    title: "操作",
    key: "action",
  },
];

onMounted(() => {
  getAllSystemConfig();
});

const getAllSystemConfig = async () => {
  try {
    spinning.value = true;
    const res = await getSystemConfig();
    SystemConfigDetails.value = addKeyName(res.data.data);
    console.log("SystemConfigDetails", SystemConfigDetails.value);
    spinning.value = false;
  } catch (e) {
    spinning.value = false;
  }
};

const addKeyName = (obj: any) => {
  for (const key in obj) {
    obj[key]["title"] = detailsKeys[key];
  }
  return obj;
};

const isShowValueFn = (keyValue: string | number): boolean => {
  let bl = false;
  Object.keys(detailsKeys).forEach((val) => {
    if (val === keyValue) {
      bl = true;
      return;
    }
  });
  return bl;
};

const openDialogFn = (key: any) => {
  Object.keys(detailsShow).forEach((val) => {
    detailsShow[val] = false;
  });
  if (key === "token") {
    tokenDialog.value?.editShow(SystemConfigDetails.value, key);
  } else if (key === "email") {
    emailDialog.value?.editShow(SystemConfigDetails.value, key);
  } else if (key === "captcha") {
    captchaDialog.value?.editShow(SystemConfigDetails.value, key);
  } else if (key === "user-login-limit") {
    limitDialog.value?.editShow(SystemConfigDetails.value, key);
  }
  detailsShow[key] = true;
};

const editBtn = (record: Record<string, any>) => {
  detailsShow["sms-verification"] = false;
  providersDialog.value?.editShow(
    SystemConfigDetails.value["sms-verification"],
    "providers",
    record
  );
  detailsShow["sms-verification"] = true;
};
</script>

<template>
  <page-container>
    <a-card>
      <a-spin :spinning="spinning">
        <div v-for="(value, key) in SystemConfigDetails" :key="key" mb-6>
          <a-descriptions
            :class="key === 'sms-verification' as any?'noPadding':null"
            :title="value.title"
            bordered
            :column="3"
          >
            <template #extra>
              <FormOutlined
                v-if="key !== 'sms-verification' as any"
                @click="openDialogFn(key)"
              />
            </template>
            <template v-for="(item, sonkey) in value" :key="sonkey">
              <a-descriptions-item
                v-if="isShowValueFn(sonkey)"
                :label="detailsKeys[sonkey]"
                :labelStyle="{ fontWeight: 'bold' }"
              >
                <span v-if="sonkey === 'is-ssl' as any">
                  {{ item === true ? "开启" : "关闭" }}
                </span>
                <a-table
                  v-else-if="sonkey === 'providers' as any"
                  :columns="columns"
                  :data-source="item"
                  :pagination="{ hideOnSinglePage: true }"
                >
                  <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'action'">
                      <a @click="editBtn(record)">
                        {{ "编辑" }}
                      </a>
                    </template>
                  </template>
                </a-table>
                <span v-else>{{ item }}</span>
              </a-descriptions-item>
            </template>
          </a-descriptions>
        </div>
      </a-spin>
    </a-card>
    <!-- 弹窗 -->
    <EditToken
      ref="tokenDialog"
      v-model:token-dialog="detailsShow['token']"
      @refreshList="getAllSystemConfig()"
    ></EditToken>
    <EditEmail
      ref="emailDialog"
      v-model:email-dialog="detailsShow['email']"
      @refreshList="getAllSystemConfig()"
    ></EditEmail>
    <EditCaptcha
      ref="captchaDialog"
      v-model:captcha-dialog="detailsShow['captcha']"
      @refreshList="getAllSystemConfig()"
    ></EditCaptcha>
    <EditLimit
      ref="limitDialog"
      v-model:limit-dialog="detailsShow['user-login-limit']"
      @refreshList="getAllSystemConfig()"
    ></EditLimit>
    <EditProviders
      ref="providersDialog"
      v-model:providers-dialog="detailsShow['sms-verification']"
      @refreshList="getAllSystemConfig()"
    ></EditProviders>
  </page-container>
</template>

<style scoped lang="less">
.anticon-form {
  font-size: 20px;
  color: var(--text-color-2);
  &:hover {
    cursor: pointer;
    color: var(--text-color-1);
  }
}

.noPadding {
  :deep(.ant-descriptions-view) {
    .ant-descriptions-row {
      .ant-descriptions-item-content {
        padding: 0;
      }
    }
  }
}
</style>
