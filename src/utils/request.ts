import router from "@/router";
import { useLogout, useToken } from "@/stores";
import { message } from "ant-design-vue";
import type { AxiosRequestConfig } from "axios";
import axios from "axios";
console.log("ENV", import.meta.env);

// 创建axios实例
const timeout = 5000; // 请求超时时间
const instance = axios.create({
  baseURL: "/api",
  timeout: timeout,
});
let requestTime = 0;

// 添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    const { token } = useToken();
    const { logoutFn } = useLogout();
    // 请求拦截，统一设置token
    if (token) {
      const time = 60 * 60000; // 前端操作token失效时间1小时，自动退出登录
      const loginTime = Number(localStorage.getItem("loginTime"));
      const curTime = Date.now();
      const dir = curTime - loginTime;
      if (dir > time) {
        // 退出登录
        logoutFn();
        // 跳转到登录页面
        router.push("/Login");
        // 结束请求 报错信息
        return Promise.reject(new Error("登录超时"));
      } else {
        // 在限定时间内调用token的时候都会重新存一次时间戳
        localStorage.setItem("loginTime", Date.now().toString());
        // 保存请求时间
        requestTime = Date.now();
      }
      // 请求头设置token
      config.headers["x-token"] = token;
      // console.log("网络层面成功", config);
    }
    return config;
  },
  (error) => {
    // console.log("网络层面失败", error);
    message.error(error);
    return Promise.reject(error);
  }
);

// 添加响应拦截器
instance.interceptors.response.use(
  (response: any) => {
    // 如果请求成功成功 2xx 就直接返回 data 中的数据
    // console.log("数据层面成功", response);
    const { updateToken, removeToken } = useToken();
    if (response.headers["new-token"]) {
      updateToken(response.headers["new-token"]);
    }

    if (
      response.data.code === 2000 &&
      !response.config.url.includes("get") &&
      !response.config.url.includes("/login/signIn") &&
      !response.config.url.includes("/login/captcha")
    ) {
      message.success(response.data.msg);
    } else if (response.data.code === 1000) {
      // 登录进去后切换角色，该角色没有菜单权限的情况，就要跳回登录页
      if (
        response.data.msg === "权限不足" &&
        response.config.url === "/menu/getMenuSelf"
      ) {
        message.error("获取菜单权限不足，请联系管理员，2秒后跳回登录页面");
        setTimeout(() => {
          removeToken();
          router.push("/Login");
        }, 2000);
      } else {
        // 通用错误，通用提示
        message.error(response.data.msg);
      }
    }
    return response;
  },
  (error) => {
    // console.error("数据层面失败", error.response);
    // 对响应错误做点什么
    if (!error.response) {
      const responseTime = Date.now();
      const dir = responseTime - requestTime;
      if (dir > timeout) {
        message.error("请求超时");
      } else {
        // 网络错误，response 没有信息
        message.error("网络错误，请换个网络环境");
      }
    } else {
      // 对响应错误做点什么 400 401 404 500 ...
      // 通用错误，通用提示
      message.error(error.response.status + " " + error.response.statusText);
    }
    return Promise.reject(error);
  }
);

export default instance;

export interface ResponseBody<T = any> {
  data: {
    code: number;
    msg: string;
    data: T;
  };
}

export const useGet = <R = any, T = any>(
  url: string,
  params?: T,
  config?: AxiosRequestConfig
): Promise<ResponseBody<R>> => {
  return instance.request({
    url,
    params,
    method: "GET",
    ...config,
  });
};

export const usePost = <R = any, T = any>(
  url: string,
  data?: T,
  config?: AxiosRequestConfig
): Promise<ResponseBody<R>> => {
  return instance.request({
    url,
    data,
    method: "POST",
    ...config,
  });
};

export const usePut = <R = any, T = any>(
  url: string,
  data?: T,
  config?: AxiosRequestConfig
): Promise<ResponseBody<R>> => {
  return instance.request({
    url,
    data,
    method: "PUT",
    ...config,
  });
};

export const useDelete = <R = any, T = any>(
  url: string,
  data?: T,
  config?: AxiosRequestConfig
): Promise<ResponseBody<R>> => {
  return instance.request({
    url,
    data,
    method: "DELETE",
    ...config,
  });
};
