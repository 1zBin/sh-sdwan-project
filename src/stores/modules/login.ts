import router from "@/router";
import { useToken, useUserStore, useAppStore } from "@/stores";
import type {
  CaptchaResult,
  EmailParams,
  LoginParams,
  LoginResult,
} from "@/types";
import _ from "lodash";
import { defineStore } from "pinia";

export const useLogin = defineStore("login", () => {
  // 注册账号
  const registerFn = (params: EmailParams) => {
    return usePost<EmailParams>("/user/signUp", params);
  };
  // 登录
  const loginFn = async (params: LoginParams, type: string) => {
    let res;
    if (type === "account") {
      res = await usePost<LoginResult, LoginParams>("/login/signIn", params);
    } else if (type === "mobile") {
      res = await usePost<LoginResult, LoginParams>(
        "/login/signInBySms",
        params
      );
    }

    if (res?.data.code === 2000) {
      const { updateToken } = useToken();
      const { setUserInfo, getUserInfo } = useUserStore();
      // 保存登录的时间戳
      localStorage.setItem("loginTime", Date.now().toString());
      updateToken(res.data.data.token);
      const result = await getUserInfo();
      setUserInfo(result.data.data.userInfo);
      console.log("userInfo", result.data.data.userInfo);

      if (result.data.data.userInfo.pageLayout) {
        // 设置布局起始值
        let defaultPageLayout = _.cloneDeep(
          result.data.data.userInfo.pageLayout
        );
        delete defaultPageLayout.CreatedAt;
        delete defaultPageLayout.UpdatedAt;
        delete defaultPageLayout.sysUserID;

        // 设置用户主题布局
        const { setLayoutSetting } = useAppStore();
        setLayoutSetting(defaultPageLayout);

        localStorage.setItem(
          "pageLayout",
          JSON.stringify({
            title: "SDWan管理系统",
            logo: "https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg",
            collapsed: false,
            drawerVisible: false,
            headerHeight: 48,
            copyright: "",
            ...defaultPageLayout,
          })
        );
      }

      // 跳转到首页
      router.push("/");
    }
    return res;
  };

  // 获取图片验证码
  const createCaptcha = () => {
    return usePost<CaptchaResult>("/login/captcha");
  };

  // 获取短信验证码
  const sendSms = (params: { phone: string }) => {
    return usePost<any, any>("/sms/sendSms", params);
  };
  return {
    loginFn,
    registerFn,
    createCaptcha,
    sendSms,
  };
});
