import { defineStore } from "pinia";
import { ref } from "vue";
export const useToken = defineStore(
  "token",
  () => {
    const token = ref<string | undefined | null>(null);
    const updateToken = (value: string | undefined | null) => {
      token.value = value;
    };
    const removeToken = () => (token.value = null);
    return {
      token,
      updateToken,
      removeToken,
    };
  },
  {
    persist: {
      enabled: true, // true 表示开启持久化保存
    },
  }
);
