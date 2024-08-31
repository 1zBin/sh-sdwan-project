<script setup lang="ts">
import { useAppStore, useLogin } from "@/stores";
import type { LoginParams } from "@/types";
import { message } from "ant-design-vue";
import { delayTimer } from "@v-c/utils";
import pageBubble from "@/utils/page-bubble";
import _ from "lodash";

const bubbleCanvas = ref<HTMLCanvasElement>();
const appStore = useAppStore();
const { layoutSetting } = storeToRefs(appStore);
const { loginFn, createCaptcha, registerFn, sendSms } = useLogin();
const loginModel: LoginParams = reactive({
  userName: undefined,
  password: undefined,
  captcha: undefined,
  captchaId: undefined,
  phone: undefined,
  email: undefined,
  verifyCode: undefined,
  type: "account",
});
const formRef = shallowRef();
const codeLoading = shallowRef(false);
const resetCounter = 60;
const submitLoading = shallowRef(false);
const registerLoading = shallowRef(false);
// 图片url地址
const imgSrc = ref<string | undefined>("");
const picTimeOut = 60000;

const { counter, pause, reset, resume, isActive } = useInterval(1000, {
  controls: true,
  immediate: false,
  callback(count) {
    if (count) {
      if (count === resetCounter) pause();
    }
  },
});

// 获取登录验证图片
const getPicPath = async () => {
  const { data } = await createCaptcha();
  if (data.code === 2000) {
    imgSrc.value = data.data.picPath;
    loginModel.captchaId = data.data.captchaId;
    // 保存第一次获取验证码的时间戳
    localStorage.setItem("getPicTime", Date.now().toString());
  }
};

// 获取验证码
const getCode = async () => {
  codeLoading.value = true;
  try {
    await formRef.value.validate(["phone"]);
    const res = await sendSms({ phone: loginModel.phone });
    if (res.data.code === 2000) {
      setTimeout(() => {
        reset();
        resume();
        codeLoading.value = false;
      }, 1000);
    }
    codeLoading.value = false;
  } catch (error) {
    codeLoading.value = false;
  }
};

// 提交登录
const submit = async () => {
  submitLoading.value = true;

  try {
    await formRef.value?.validate();
    let submitData = JSON.parse(JSON.stringify(loginModel));
    // 账号登录
    if (submitData.type === "account") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(submitData.userName)) {
        submitData.email = submitData.userName;
        delete submitData.userName;
      }
      delete submitData.phone;
      delete submitData.verifyCode;

      const picTime = Number(localStorage.getItem("getPicTime"));
      const curTime = Date.now();
      const dir = curTime - picTime;
      if (dir > picTimeOut) {
        message.warning("验证码已失效，请重新获取！");
        getPicPath();
        submitLoading.value = false;
        return;
      }

      // 账号登录
      delete submitData.type;
      const res = await loginFn(submitData, "account");
      setTimeout(() => {
        // 重置表单
        formRef.value?.resetFields();
        submitLoading.value = false;
        if (res.data.code === 1000) {
          getPicPath();
        }
      }, 1000);
    }
    // 手机登录
    else if (submitData.type === "mobile") {
      delete submitData.email;
      delete submitData.userName;
      delete submitData.password;
      delete submitData.captcha;
      delete submitData.captchaId;
      delete submitData.type;
      await loginFn(submitData, "mobile");
      setTimeout(() => {
        // 重置表单
        formRef.value?.resetFields();
        submitLoading.value = false;
      }, 500);
    }
  } catch (e) {
    console.warn(e);
    submitLoading.value = false;
  }
};

// 点击注册
const registerAccount = async () => {
  registerLoading.value = true;
  try {
    await formRef.value?.validate();
    const res = await registerFn({ email: loginModel.email });
    console.log("注册", res);
    registerLoading.value = false;
  } catch (e) {
    console.warn(e);
    registerLoading.value = false;
  }
};

// 点击忘记密码节流
const forgetFn = _.throttle(() => {
  message.warning("请联系管理员重设密码！");
}, 3200);

onMounted(async () => {
  getPicPath();
  await delayTimer(300);
  pageBubble.init(unref(bubbleCanvas)!);
});

onBeforeUnmount(() => {
  pageBubble.removeListeners();
});
</script>

<template>
  <div class="login-container">
    <div h-screen w-screen absolute>
      <canvas ref="bubbleCanvas" absolute z-1 />
    </div>
    <div class="login-content" flex justify-center items-center>
      <div class="ant-pro-form-login-main">
        <!-- 登录头部 -->
        <div flex justify-between items-center h-15 px-4 mb-2px>
          <div>
            <span class="ant-pro-form-login-logo">
              <!-- <img w-full h-full object-cover src="/logo.svg" /> -->
            </span>
            <span class="ant-pro-form-login-title"> SDWan管理系统 </span>
            <span class="ant-pro-form-login-desc">
              {{ "舜航SDWan管理系统" }}
            </span>
          </div>
          <div class="login-lang flex-center relative z-11">
            <span
              class="flex-center cursor-pointer text-16px"
              @click="
                appStore.toggleTheme(
                  layoutSetting.theme === 'dark' ? 'light' : 'dark'
                )
              "
            >
              <!-- 亮色和暗黑模式切换按钮 -->
              <template v-if="layoutSetting.theme === 'light'">
                <carbon-moon />
              </template>
              <template v-else>
                <carbon-sun />
              </template>
            </span>
          </div>
        </div>
        <a-divider m-0 />
        <!-- 登录主体 -->
        <div class="box-border flex min-h-[520px]">
          <!-- 登录框左侧 -->
          <div
            flex
            justify-center
            items-center
            class="ant-pro-form-login-main-left"
          >
            <img src="@/assets/images/login-left.png" class="h-5/6 w-5/6" />
          </div>
          <a-divider
            m-0
            type="vertical"
            class="ant-pro-login-divider min-h-[520px]"
          />
          <!-- 登录框右侧 -->
          <div
            class="ant-pro-form-login-main-right px-5 w-[335px] flex-center flex-col relative z-11"
          >
            <div class="text-center py-6 text-2xl">
              {{ "欢迎使用本系统" }}
            </div>
            <a-form ref="formRef" :model="loginModel">
              <!-- 登录方式选择 -->
              <a-tabs v-model:activeKey="loginModel.type" centered>
                <a-tab-pane key="account" tab="账户密码登录" />
                <a-tab-pane key="mobile" tab="手机号登录" />
              </a-tabs>

              <!-- 账号登录界面 -->
              <template v-if="loginModel.type === 'account'">
                <a-form-item
                  name="userName"
                  :rules="[
                    { required: true, message: '用户名/邮箱地址不能为空！' },
                  ]"
                >
                  <a-input
                    v-model:value.trim="loginModel.userName"
                    allow-clear
                    placeholder="用户名/邮箱地址"
                    size="large"
                    @pressEnter="submit"
                  >
                    <template #prefix>
                      <UserOutlined />
                    </template>
                  </a-input>
                </a-form-item>
                <a-form-item
                  name="password"
                  :rules="[{ required: true, message: '密码不能为空' }]"
                >
                  <a-input-password
                    v-model:value.trim="loginModel.password"
                    allow-clear
                    placeholder="密码"
                    size="large"
                    @pressEnter="submit"
                  >
                    <template #prefix>
                      <LockOutlined />
                    </template>
                  </a-input-password>
                </a-form-item>
                <a-form-item
                  name="captcha"
                  :rules="[{ required: true, message: '验证码不能为空' }]"
                >
                  <div flex items-center justify-between w-full>
                    <a-input
                      style="width: 50%; margin-right: 5px"
                      v-model:value.trim="loginModel.captcha"
                      placeholder="验证码"
                      size="large"
                      @pressEnter="submit"
                    >
                    </a-input>
                    <img
                      :src="imgSrc"
                      alt=""
                      @click="getPicPath()"
                      w-40
                      h-40px
                      rounded-lg
                      style="border: 1px solid #d9d9d9"
                    />
                  </div>
                </a-form-item>
              </template>

              <!-- 手机号登录界面 -->
              <template v-if="loginModel.type === 'mobile'">
                <a-form-item
                  name="phone"
                  :rules="[{ required: true, message: '手机号不能为空' }]"
                >
                  <a-input
                    v-model:value.trim="loginModel.phone"
                    allow-clear
                    placeholder="请输入手机号！"
                    size="large"
                    @pressEnter="submit"
                  >
                    <template #prefix>
                      <MobileOutlined />
                    </template>
                  </a-input>
                </a-form-item>
                <a-form-item
                  name="verifyCode"
                  :rules="[{ required: true, message: '验证码不能为空' }]"
                >
                  <div flex items-center>
                    <a-input
                      v-model:value.trim="loginModel.verifyCode"
                      style="
                        flex: 1 1 0%;
                        transition: width 0.3s ease 0s;
                        margin-right: 8px;
                      "
                      allow-clear
                      placeholder="请输入验证码！"
                      size="large"
                      @pressEnter="submit"
                    >
                      <template #prefix>
                        <LockOutlined />
                      </template>
                    </a-input>
                    <a-button
                      :loading="codeLoading"
                      :disabled="isActive"
                      size="large"
                      @click="getCode"
                    >
                      <template v-if="!isActive"> 获取验证码 </template>
                      <template v-else>
                        {{ resetCounter - counter }} 秒后重新获取
                      </template>
                    </a-button>
                  </div>
                </a-form-item>
              </template>

              <!-- 注册界面 -->
              <template v-if="loginModel.type === 'register'">
                <a-form-item
                  name="email"
                  :rules="[{ required: true, message: '邮箱地址不能为空！' }]"
                >
                  <a-input
                    v-model:value.trim="loginModel.email"
                    allow-clear
                    placeholder="请输入电子邮箱！"
                    size="large"
                    @pressEnter="submit"
                  >
                    <template #prefix>
                      <MailOutlined />
                    </template>
                  </a-input>
                </a-form-item>
              </template>

              <!-- 点击注册或忘记密码 -->
              <div class="mb-24px" flex items-center justify-end>
                <div mr-8px>
                  <!-- <a
                    v-if="loginModel.type !== 'register'"
                    @click="loginModel.type = 'register'"
                    >注册账号</a
                  > -->
                  <a
                    v-if="loginModel.type === 'register'"
                    @click="loginModel.type = 'account'"
                    >返回登录</a
                  >
                </div>
                <a style="color: coral" @click="forgetFn()">忘记密码 ?</a>
              </div>

              <!-- 底部按钮 -->
              <a-button
                v-if="loginModel.type === 'register'"
                type="primary"
                block
                :loading="registerLoading"
                size="large"
                @click="registerAccount"
              >
                注册
              </a-button>
              <a-button
                v-else
                type="primary"
                block
                :loading="submitLoading"
                size="large"
                @click="submit"
              >
                登录
              </a-button>
            </a-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.login-container {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
  overflow: auto;
  background: var(--bg-color-container);
}

.login-lang {
  height: 40px;
  line-height: 44px;
}

//.login-content {
// position: absolute;
// top: 0;
// left: 0;
// right: 0;
// bottom: 0;
//}

.ant-pro-form-login-container {
  display: flex;
  flex: 1 1;
  flex-direction: column;
  height: 100%;
  padding: 32px 0;
  overflow: auto;
  background: inherit;
}

.ant-pro-form-login-header a {
  text-decoration: none;
}

.ant-pro-form-login-title {
  color: var(--text-color);
  font-weight: 600;
  font-size: 33px;
  line-height: 1;
}

.ant-pro-form-login-logo {
  width: 44px;
  height: 44px;
  margin-right: 16px;
  vertical-align: top;
}

.ant-pro-form-login-desc {
  color: var(--text-color-1);
  font-size: 14px;
  margin-left: 16px;
}

.ant-pro-form-login-main-right {
  .ant-tabs-nav-list {
    margin: 0 auto;
    font-size: 16px;
  }

  .ant-pro-form-login-other {
    line-height: 22px;
    text-align: center;
  }
}

.ant-pro-form-login-main {
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 1rem;
  box-shadow: 2px 0 8px 0 rgba(29, 35, 41, 0.08);
  overflow: hidden;
  z-index: 2;
}

.icon {
  margin-left: 8px;
  color: var(--text-color-2);
  font-size: 24px;
  vertical-align: middle;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: var(--pro-ant-color-primary);
  }
}
.login-media(@width:100%) {
  .ant-pro-form-login-main {
    width: @width;
  }
  .ant-pro-form-login-main-left {
    min-height: 520px;
    display: none;
  }
  .ant-pro-form-login-main-right {
    width: 100%;
  }
  .ant-pro-form-login-desc {
    display: none;
  }
}
@media (min-width: 992px) {
  .login-container {
    background-image: url(https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg);
    background-repeat: no-repeat;
    background-position: center 110px;
    background-size: 100%;
  }

  .ant-pro-form-login-main-left {
    width: 700px;
  }
}
@media (min-width: 768px) and (max-width: 991px) {
  .ant-pro-login-divider {
    display: none;
  }
  .login-media(400px);
}
@media screen and (max-width: 767px) {
  .login-media(350px);

  .ant-pro-login-divider {
    display: none;
  }
}
</style>
