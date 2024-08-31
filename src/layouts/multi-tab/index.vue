<script lang="ts" setup>
import { useAppStore, useMultiTab } from "@/stores";
import { CloseOutlined, ReloadOutlined } from "@ant-design/icons-vue";
import type { CSSProperties } from "vue";
import Sortable, { SortableEvent } from "sortablejs";

export interface MultiTabItem {
  path: string;
  fullPath: string;
  title: string;
  name?: string;
  icon?: string;
  // 判断当前是不是一个固定的标签
  affix?: boolean;
  loading?: boolean;
}

const multiTabStore = useMultiTab();
const { list, activeKey } = storeToRefs(multiTabStore);
const { layoutSetting } = storeToRefs(useAppStore());
const tabStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = {};
  if (layoutSetting.value.multiTabFixed) {
    style.position = "fixed";
    style.top = `${layoutSetting.value.headerHeight}px`;
    style.zIndex = 1;
  }

  return style;
});
const tabsRef = shallowRef();
const { height } = useElementSize(tabsRef);

function handleSwitch({ key }: any, current: string) {
  if (key === "closeCurrent") multiTabStore.close(activeKey.value);
  else if (key === "closeLeft") multiTabStore.closeLeft(current);
  else if (key === "closeRight") multiTabStore.closeRight(current);
  else if (key === "closeOther") multiTabStore.closeOther(current);
  else if (key === "refresh") multiTabStore.refresh(activeKey.value);
}
const isCurrentDisabled = computed(() => {
  return (
    list.value.length === 1 ||
    list.value.filter((v: MultiTabItem) => !v.affix).length <= 1
  );
});
const otherDisabled = computed(() => {
  return (
    list.value.length === 1 ||
    list.value.filter((v: MultiTabItem) => !v.affix).length <= 1
  );
});

onMounted(() => {
  nextTick(() => {
    createSort();
  });
});

let timer: any;
const createSort = () => {
  timer = setTimeout(() => {
    rowDrop();
  }, 500);
};
let sortable: any;
const rowDrop = () => {
  const navList = document.getElementsByClassName(
    "ant-tabs-nav-list"
  )[0] as HTMLElement; // 将返回的 Element 类型转换为 HTMLElement 类型
  if (navList) {
    sortable = Sortable.create(navList, {
      animation: 150,
      onEnd: (event: SortableEvent) => {
        const newIndex = event.newIndex as number;
        const oldIndex = event.oldIndex as number;
        const movedData = arraymove(
          JSON.parse(JSON.stringify(list.value)),
          oldIndex,
          newIndex
        );
        console.log(movedData);
      },
    });
  }
};

const arraymove = (arr: any[], fromIndex: number, toIndex: number) => {
  var element = arr[fromIndex];
  arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, element);
  let tmp: any = [];
  arr.forEach((s) => {
    if (s) {
      tmp.push(s);
    }
  });
  return tmp;
};

onUnmounted(() => {
  destorySort();
});
const destorySort = () => {
  clearTimeout(timer);
  if (sortable) {
    sortable.destroy();
    sortable = null;
  }
};
</script>

<template>
  <div
    v-if="layoutSetting.multiTabFixed"
    :style="{ height: `${height + 10}px` }"
  />
  <a-tabs
    ref="tabsRef"
    :active-key="activeKey"
    :style="tabStyle"
    class="bg-white dark:bg-#242525 w-100%"
    pt-10px
    type="card"
    size="small"
    :tab-bar-gutter="5"
    @update:active-key="multiTabStore.switchTab"
  >
    <a-tab-pane v-for="item in list" :key="item.fullPath">
      <template #tab>
        {{ item.title }}
        <button
          v-if="activeKey === item.fullPath"
          class="ant-tabs-tab-remove"
          style="margin: 0"
          @click.stop="multiTabStore.refresh(item.fullPath)"
        >
          <ReloadOutlined :spin="item.loading" />
        </button>
        <button
          v-if="!item.affix && list.length > 1"
          class="ant-tabs-tab-remove"
          style="margin: 0"
          @click.stop="multiTabStore.close(item.fullPath)"
        >
          <CloseOutlined />
        </button>
      </template>
    </a-tab-pane>
    <template #leftExtra>
      <div class="w-24px" />
    </template>
    <template #rightExtra>
      <div class="w-48px flex item-center justify-center">
        <a-dropdown :trigger="['hover']">
          <MoreOutlined class="text-16px" />
          <template #overlay>
            <a-menu @click="handleSwitch($event, activeKey)">
              <a-menu-item
                key="closeOther"
                :disabled="isCurrentDisabled || otherDisabled"
              >
                {{ "关闭其他" }}
              </a-menu-item>
              <a-menu-item key="refresh">
                {{ "刷新当前" }}
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </template>
  </a-tabs>
</template>

<style scoped lang="less">
:deep(.ant-tabs-nav-operations) {
  display: none !important;
}
</style>
