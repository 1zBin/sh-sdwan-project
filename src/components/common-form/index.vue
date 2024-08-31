<script setup lang="ts">
import type { FormInstance } from "ant-design-vue";

const props = defineProps({
  // 自定义双向绑定传值
  modelValue: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // 父组件v-bind绑定formDataConfig表单参数
  name: {
    type: String,
    required: true,
    default: "",
  },
  formItems: {
    type: Array,
    required: true,
    default: () => [],
  },
  rules: {
    type: Object,
    required: false,
    default: () => ({}),
  },
  // 其他特殊参数
  formLayout: {
    type: String,
    required: false,
    default: () => "horizontal",
  },
  formLabelCol: {
    type: Object,
    required: false,
    default: () => ({ span: 4 }),
  },
  formItemColSpan: {
    type: Number,
    required: false,
    default: null,
  },
  formItemLabelCol: {
    type: Object,
    required: false,
    default: null,
  },
});

const emits = defineEmits([
  "update:modelValue",
  "selectChangeFn",
  "changeSwitchFn",
]);

const formRef = ref<FormInstance | null>(null);
// 暴露出Form表单组件
defineExpose({ formRef });

// input框值改变
// const handleValueChange = (value: string | undefined, name: string) => {
//   emits("update:modelValue", {
//     ...props.modelValue,
//     [name]: value,
//   });
// };

// inputNumber Change回调
// const inputNumberChange = (
//   value: string | number | undefined,
//   name: string
// ) => {
//   emits("update:modelValue", {
//     ...props.modelValue,
//     [name]: value,
//   });
// };

// 改变用户状态
const changeSwitchFn = (checked: boolean | string | number, name: string) => {
  if (name === "is_ssl") {
    emits("changeSwitchFn", checked, name);
  } else {
    emits("update:modelValue", {
      ...props.modelValue,
      [name]: checked,
    });
  }
};

// select下拉菜单
const selectChangeFn = (value: any, name: string) => {
  emits("selectChangeFn", value, name);
};

// 日期选择器
const changeDateFn = (date: any, name: string) => {
  // let datePicker = "";
  // if (date) {
  //   datePicker = date.replace(/ /g, "T") + "+08:00";
  // }
  // emits("update:modelValue", {
  //   ...props.modelValue,
  //   [name]: datePicker,
  // });
  emits("update:modelValue", {
    ...props.modelValue,
    [name]: date,
  });
};
</script>

<template>
  <a-form
    ref="formRef"
    :model="modelValue"
    :rules="props.rules"
    :layout="props.formLayout"
    :labelCol="props.formLabelCol"
  >
    <a-row :gutter="24">
      <!-- 
          xs:<576px; 
          sm:≥576px; 
          md:≥768px; 
          lg:≥992px; 
          xl:≥1200px;
          xxl:≥1600px;
          xxxl:≥2000px; 
        -->
      <template v-for="item in props.formItems as any" :key="item.name">
        <a-col
          :xs="item.colXsSpan ? item.colXsSpan : 24"
          :sm="item.colSmSpan ? item.colSmSpan : 24"
          :lg="item.colLgSpan ? item.colLgSpan : 24"
          :xl="
            item.colXlSpan
              ? item.colXlSpan
              : formItemColSpan
              ? formItemColSpan
              : 12
          "
          :xxl="
            item.colXxlSpan
              ? item.colXxlSpan
              : formItemColSpan
              ? formItemColSpan
              : 12
          "
          style="padding: 0"
        >
          <a-form-item
            :labelCol="{
              sm: item.labelSmCol ? item.labelSmCol : { span: 6 },
              lg: item.labelLgCol ? item.labelLgCol : { span: 6 },
              xl: item.labelXlCol
                ? item.labelXlCol
                : formItemLabelCol
                ? formItemLabelCol
                : { span: 8 },
              xxl: item.labelXxlCol
                ? item.labelXxlCol
                : formItemLabelCol
                ? formItemLabelCol
                : { span: 8 },
            }"
            labelAlign="right"
            :label="item.label"
            :name="item.name"
          >
            <!-- item插槽 -->
            <template v-if="item.type.includes('Slot_')">
              <slot :name="`${item.type}`" />
            </template>
            <!-- 输入框 -->
            <template v-else-if="item.type === 'input'">
              <a-input
                :style="item.style ? item.style : null"
                :disabled="
                  item.disabled || (modelValue.id && item.updatedDisabled)
                    ? true
                    : false
                "
                v-model:value.trim="modelValue[item.name]"
                :placeholder="item.placeholder"
                :addon-before="item.addonBefore ? item.addonBefore : null"
                :addon-after="item.addonAfter ? item.addonAfter : null"
              ></a-input>
            </template>

            <!-- 数字输入框 -->
            <template v-else-if="item.type === 'inputNumber'">
              <a-input-number
                :disabled="
                  item.disabled || (modelValue.id && item.updatedDisabled)
                    ? true
                    : false
                "
                :style="item.style ? item.style : null"
                v-model:value="modelValue[item.name]"
                :placeholder="item.placeholder"
                :min="item.min"
                :max="item.max"
                :controls="item.controls"
                :addon-before="item.addonBefore ? item.addonBefore : null"
                :addon-after="item.addonAfter ? item.addonAfter : null"
              />
            </template>

            <!-- 下拉菜单 -->
            <template v-else-if="item.type === 'select'">
              <a-select
                :style="item.style ? item.style : null"
                :disabled="item.disabled ? true : false"
                :options="
                  item.options.length ? item.options : item.selectOptions
                "
                :placeholder="item.placeholder"
                :value="modelValue[item.name]"
                @change="selectChangeFn($event, item.name)"
              >
              </a-select>
            </template>

            <!-- 状态开关 -->
            <template v-else-if="item.type === 'switch'">
              <a-switch
                :checked="modelValue[item.name]"
                @change="changeSwitchFn($event, item.name)"
                :checkedValue="item.checkedValue"
                :unCheckedValue="item.unCheckedValue"
              />
            </template>

            <!-- 单选组 -->
            <template v-else-if="item.type === 'radioGroup'">
              <a-radio-group v-model:value="modelValue[item.name]">
                <a-radio :value="false">显示</a-radio>
                <a-radio :value="true">隐藏</a-radio>
              </a-radio-group>
            </template>

            <!-- 日期选择器 -->
            <template v-else-if="item.type === 'datePicker'">
              <a-date-picker
                style="width: 100%"
                value-format="YYYY-MM-DD"
                :value="modelValue[item.name]"
                @change="changeDateFn($event, item.name)"
              />
            </template>

            <!-- 备注文本域 -->
            <template v-else-if="item.type === 'textarea'">
              <a-textarea
                v-model:value="modelValue[item.name]"
                :rows="item.rows"
                :placeholder="item.placeholder"
                :disabled="
                  item.disabled || (modelValue.ID && item.updatedDisabled)
                    ? true
                    : false
                "
              />
            </template>
          </a-form-item>
        </a-col>
      </template>
    </a-row>
  </a-form>
</template>

<style scoped></style>
