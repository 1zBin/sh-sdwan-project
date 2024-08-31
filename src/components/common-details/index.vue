<script lang="ts" setup>
import { detailsKeys } from "./data/keys.ts";
const props = defineProps({
  detailsShow: {
    type: Boolean,
    default: false,
  },
  detailsContent: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  descriptionsStyle: {
    type: Object,
    default: {
      column: 1,
      bordered: false,
    },
  },
  title: {
    type: String,
    default: "",
  },
});

const emits = defineEmits(["update:detailsShow"]);

const isDetailsShow = computed({
  get: () => props.detailsShow,
  set: (val) => emits("update:detailsShow", val),
});

const detailsData = ref({});

const afterOpenChange = () => {
  if (!isDetailsShow) return;
  detailsData.value = reorderObjectKeys(props.detailsContent, detailsKeys);
};

const reorderObjectKeys = (obj: any, keyOrder: Record<string, string>): any => {
  const reorderedObj: any = {};

  // 遍历 keyOrder 对象的键名顺序
  for (const key in keyOrder) {
    if (obj.hasOwnProperty(key)) {
      reorderedObj[key] = obj[key];
    }
  }

  // 处理剩余的键名
  for (const key in obj) {
    if (!reorderedObj.hasOwnProperty(key)) {
      reorderedObj[key] = obj[key];
    }
  }
  return reorderedObj;
};

// 获取数组或对象中的name
const changeStringFn = (value: Record<string, any>, key: string) => {
  let str = "";
  if (Array.isArray(value) && value.length) {
    str = value.map((v) => v[key]).toString();
  }
  return str;
};

// 判断对象是否包含某个键名
function hasKey(obj: any, key: any): key is keyof typeof obj {
  return key in obj;
}

const isShowValueFn = (keyValue: string) => {
  let bl = false;
  if (hasKey(detailsKeys, keyValue)) bl = true;
  return bl;
};

// 关闭抽屉
const onClose = () => {
  isDetailsShow.value = false;
  detailsData.value = {};
};
</script>

<template>
  <a-drawer
    placement="right"
    rootClassName="common-details"
    v-model:open="isDetailsShow"
    :title="props.title"
    :destroyOnClose="true"
    @close="onClose"
    @afterOpenChange="afterOpenChange"
  >
    <a-descriptions
      :layout="
        descriptionsStyle.detailsLayout
          ? descriptionsStyle.detailsLayout
          : 'horizontal'
      "
      :column="descriptionsStyle.column"
      :bordered="descriptionsStyle.bordered"
      :size="descriptionsStyle.size ? descriptionsStyle.size : 'middle'"
    >
      <template v-for="(value, key) in detailsData" :key="key">
        <a-descriptions-item
          v-if="isShowValueFn(key)"
          :label="detailsKeys[key]"
          :ellipsis="true"
          :labelStyle="
            descriptionsStyle.labelStyle ? descriptionsStyle.labelStyle : null
          "
          :contentStyle="
            descriptionsStyle.contentStyle
              ? descriptionsStyle.contentStyle
              : null
          "
        >
          <template v-if="key === 'status'">
            <span>{{ value === "1" ? "已使用" : "未使用" }}</span>
          </template>
          <template v-else-if="key === 'useTls'">
            <span>{{ value === "1" ? "启用" : "不启用" }}</span>
          </template>
          <template v-else-if="key === 'sim'">
            <span>{{ value ? "支持" : "不支持" }}</span>
          </template>
          <template v-else-if="key === 'wifi'">
            <span>{{ value ? "支持" : "不支持" }}</span>
          </template>
          <template v-else-if="key === 'disabled'">
            <span>{{ value === "yes" ? "禁用" : "不禁用" }}</span>
          </template>
          <template v-else-if="key === 'popKind'">
            <span>{{ changeStringFn(value, "kind") }}</span>
          </template>
          <template
            v-else-if="
              value === null ||
              value === undefined ||
              value === '' ||
              ((value as any[]) && (value as any[]).length === 0) 
            "
          >
            <span>{{ "--" }}</span>
          </template>
          <template v-else>
            <span>{{ value }}</span>
          </template>
        </a-descriptions-item>
      </template>
    </a-descriptions>
  </a-drawer>
</template>

<style>
.common-details {
  .ant-drawer-content-wrapper {
    .ant-drawer-content {
      .ant-drawer-wrapper-body {
        .ant-drawer-header {
          .ant-drawer-header-title {
            justify-content: space-between;
            flex-flow: row-reverse !important;
          }
        }
      }
    }
  }
}
</style>
