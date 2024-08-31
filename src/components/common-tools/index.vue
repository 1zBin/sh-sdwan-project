<script setup lang="ts">
import type { CommonPageData } from "@/types";
import type { FormInstance } from "ant-design-vue";

const props = defineProps({
  topToolsConfig: {
    type: Object,
    required: true,
  },
  pageData: {
    type: Object,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  styleConfig: {
    type: Object,
    required: false,
    default: () => ({}),
  },
});

const emits = defineEmits(["searchFn", "onSelectChange", "onResetFn"]);

const route = useRoute();
const expand = ref<boolean>(false);
const formRef = ref<FormInstance | null>(null);
const formModel = reactive<any>(props.pageData);

// 更新分页参数
const newPageData = reactive<CommonPageData>({
  page: props.pageData.page,
  pageSize: props.pageData.pageSize,
  total: props.pageData.total,
});

// 查询按钮
const onSearch = () => {
  emits("searchFn", { ...newPageData, ...formModel });
};

const onSelectChange = (value: any) => {
  console.log("onSelectChange", value);
  emits("onSelectChange", value);
};

// 重置
const onReset = () => {
  formRef.value?.resetFields();
  expand.value = false;
  // 个别页面特殊处理需调用父组件重置
  const pathList = [
    "/journal/loginLog",
    "/journal/limitLog",
    "/slb-m/networkCardIp",
    "/slb-m/networkCardRoute",
  ];
  if (pathList.includes(route.path)) {
    emits("onResetFn");
  } else {
    onSearch();
  }
};
</script>

<template>
  <a-card
    mb-4
    v-if="topToolsConfig.search && topToolsConfig.search.length"
    :bodyStyle="styleConfig.antCardStyle ? styleConfig.antCardStyle : {}"
  >
    <a-form
      ref="formRef"
      :label-col="{ span: 6 }"
      :model="formModel"
      labelAlign="right"
    >
      <a-row :gutter="[15, 0]">
        <template v-for="item in topToolsConfig.search" :key="item.key">
          <a-col
            :class="styleConfig.size ? 'custom-col' : null"
            :span="8"
            v-if="expand || item.key <= 3"
          >
            <!-- input类型 -->
            <a-form-item
              v-if="item.type === 'text'"
              :name="item.keyword"
              :label="item.name"
              :labelCol="{ pull: 0 }"
            >
              <a-input
                :size="styleConfig.size ? styleConfig.size : 'middle'"
                v-model:value.trim="formModel[item.keyword]"
                :placeholder="item.name"
                @pressEnter="onSearch()"
              ></a-input>
            </a-form-item>
            <!-- 下拉框 -->
            <a-form-item
              v-if="item.type === 'select'"
              :name="item.keyword"
              :label="item.name"
              :labelCol="{ pull: 0 }"
            >
              <a-input-group>
                <a-select
                  v-model:value="formModel[item.keyword]"
                  style="width: 100%"
                  :size="styleConfig.size ? styleConfig.size : 'middle'"
                  :placeholder="item.name"
                  @change="onSelectChange"
                >
                  <a-select-option
                    v-for="val in item.options"
                    :key="val.value"
                    :value="val.value"
                    >{{ val.label }}</a-select-option
                  >
                </a-select>
              </a-input-group>
            </a-form-item>
          </a-col>
        </template>
      </a-row>
      <a-row :span="24" style="text-align: right">
        <a-col :span="24">
          <a-space flex justify-end w-full>
            <a-button
              :size="styleConfig.size ? styleConfig.size : 'middle'"
              :loading="loading"
              type="primary"
              @click="onSearch"
            >
              查询
            </a-button>
            <a-button
              :size="styleConfig.size ? styleConfig.size : 'middle'"
              :loading="loading"
              @click="onReset"
            >
              重置
            </a-button>
            <a-button
              v-if="topToolsConfig.search.length > 3"
              type="link"
              @click="expand = !expand"
            >
              {{ expand ? "收起" : "展开" }}
              <UpOutlined v-if="expand" />
              <DownOutlined v-else />
            </a-button>
          </a-space>
        </a-col>
      </a-row>
    </a-form>
  </a-card>
</template>

<style scoped>
.custom-col {
  height: 36px !important;
}
</style>
