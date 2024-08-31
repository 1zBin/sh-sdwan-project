import { defineStore } from "pinia";
import { useToken, useUserStore } from "@/stores";
import router from "@/router";

export const useLogout = defineStore("logout", () => {
  const { removeUserInfo } = useUserStore();
  const { removeToken } = useToken();

  const logoutFn = () => {
    removeUserInfo();
    removeToken();
    // 清空本地存储的主题布局
    localStorage.removeItem("pageLayout");
    router.push("Login");
  };
  return {
    logoutFn,
  };
});
