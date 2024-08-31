//导入自定义指令
import { useDebounceDirective, useThrottleDirective } from "./instruction";

const directives = {
  //汇总自定义指令
  debounce: useDebounceDirective(500), // 防抖 500ms
  throttle: useThrottleDirective(1000), // 节流 1000ms
} as any;

export default {
  //导出自定义指令
  install(app: any) {
    // 以安装的方式插到app中
    Object.keys(directives).forEach((key) => {
      // 遍历directives对象的key
      app.directive(key, directives[key]); // 将每个directive注册到app中
    });
  },
};
