<script setup lang="ts">
import { delayTimer, isFunction } from "@v-c/utils";
import type { VNodeChild } from "vue";
import { useAppStore, useMultiTab } from "@/stores";
import { useLayoutState } from "~/layouts/basic-layout/context";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const props = defineProps({
  current: {
    type: Object,
    default: () => {},
  },
  styleConfig: {
    type: Object,
  },
});

defineSlots<{
  default(props: any): any;
  title(props: any): any;
  content(props: any): any;
  extraContent(props: any): any;
  extra(props: any): any;
  footer(props: any): any;
}>();
const appStore = useAppStore();
const { layoutSetting } = storeToRefs(appStore);
const multiTabStore = useMultiTab();
const currentItem = computed(() => {
  //   const key: string = selectedKeys.value.length ? selectedKeys.value[0] : "";
  //   if (key && menuDataMap.value.has(key)) return menuDataMap.value.get(key);
  //   return {} as any;
  return props.current;
});
const { contentWidth, hasPageContainer } = useLayoutState();
async function switchPage(bool: boolean) {
  await delayTimer(300);
  hasPageContainer.value = bool;
}

onMounted(async () => {
  await switchPage(true);
});
onUnmounted(async () => {
  await switchPage(false);
});
onActivated(async () => {
  await switchPage(true);
});
onDeactivated(async () => {
  await switchPage(false);
});
const contentCls = computed(() => {
  const cls: string[] = ["flex flex-col flex-1"];
  if (contentWidth.value === ("Fluid" as number | string)) cls.push("w-full");
  else if (contentWidth.value === ("Fixed" as number | string))
    cls.push(...["max-w-1200px w-1200px", "mx-auto"]);

  return cls;
});
function renderTitle(title: VNodeChild | (() => VNodeChild)) {
  if (isFunction(title)) return title();

  return title;
}

const goBlackFn = () => {
  const fullPath = route.fullPath;
  router.push({ path: props.current.goBlackPath });
  setTimeout(() => {
    multiTabStore.close(fullPath);
  }, 500);
};
</script>

<template>
  <div>
    <div
      v-if="!styleConfig"
      class="bg-[var(--bg-color)]"
      :class="layoutSetting.multiTab ? 'pb-16px' : 'py-16px'"
      px-24px
      mb-24px
      mx--24px
      mt--24px
    >
      <a-breadcrumb v-if="!currentItem.hideInBreadcrumb">
        <template v-if="currentItem.matched?.length">
          <a-breadcrumb-item
            v-for="item in currentItem.matched"
            :key="item.path"
          >
            {{ renderTitle(item.title) }}
          </a-breadcrumb-item>
        </template>
        <a-breadcrumb-item>
          {{ renderTitle(currentItem.title) }}
        </a-breadcrumb-item>
      </a-breadcrumb>
      <div flex mt-8px justify-between>
        <div flex items-center my-4px of-hidden>
          <slot name="title">
            <div v-if="currentItem.isBlack">
              <ArrowLeftOutlined
                class="isBlack"
                mr-2
                text-20px
                v-if="currentItem.isBlack"
                @click="goBlackFn()"
              />

              <span text-20px line-height-32px mr-12px mb-0 truncate font-600>{{
                renderTitle(currentItem.title)
              }}</span>
            </div>
            <span
              v-else
              text-20px
              line-height-32px
              mr-12px
              mb-0
              truncate
              font-600
              >{{ renderTitle(currentItem.title) }}</span
            >
          </slot>
        </div>
        <div>
          <slot name="extra" />
        </div>
      </div>
    </div>
    <div :class="contentCls">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="less">
.isBlack {
  cursor: pointer;
  &:hover {
    color: var(--text-color-1);
  }
}
</style>
