// 防抖指令封装
export const useDebounceDirective = (delay: number) => {
  return {
    beforeMount(el: HTMLElement, binding: any) {
      let timer: any;

      el.addEventListener(binding.arg, () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          binding.value();
        }, delay);
      });
    },
  };
};

// 节流指令封装
export const useThrottleDirective = (delay: number) => {
  return {
    beforeMount(el: HTMLElement, binding: any) {
      let throttled = false;

      el.addEventListener(binding.arg, () => {
        if (!throttled) {
          throttled = true;
          setTimeout(() => {
            binding.value();
            throttled = false;
          }, delay);
        }
      });
    },
  };
};
