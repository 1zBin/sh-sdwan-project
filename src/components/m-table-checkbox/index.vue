<script setup lang="ts">
import { arrDemotionValue } from "@/utils/formItemChange.js";
import { cloneDeep } from "lodash-es";
import { useSelectedRow } from "~@/stores";

const props = defineProps({
  // 自定义双向绑定传值
  modelValue: {
    type: Object,
    required: true,
  },
  // 定义参数
  parameters: {
    type: Object,
    required: true,
  },
});
const emits = defineEmits(["update:modelValue"]);

const routeAllPathToCompMap = import.meta.glob(
  `../../../src/pages/**/**/index.vue`
) as any;

// 懒加载单个组件
const TableModel = defineAsyncComponent(
  routeAllPathToCompMap[`${props.parameters.path}`]
);

const computedValue = computed({
  get: () => props.modelValue,
  set: (val) => {
    if (modalTableIds.value.length) {
      emits("update:modelValue", {
        ...props.modelValue,
        [props.parameters.name]: val,
        [props.parameters.ids]: val.map((v: any) => v.id),
      });
    } else {
      emits("update:modelValue", {
        ...props.modelValue,
        [props.parameters.name]: [],
        [props.parameters.ids]: [],
      });
    }
  },
});

const selectedRow = useSelectedRow();
const { modalTableIds, modalTableList } = toRefs(selectedRow);
const tableShow = ref(false);
const styleConfig = {
  type: "modalTable",
  size: "small",
  tableType: "checkbox",
  delAction: true,
  topBtnShow: "hidden",
  antCardStyle: {
    padding: "16px",
  },
};

let originalData: any = {};
onMounted(() => {
  originalData = cloneDeep(props.modelValue);
});

// 打开表格弹窗
const openTableFn = () => {
  if (props.parameters.updatedDisabled && props.modelValue.id) return;
  selectedRow.setOrginModalTable(props.modelValue[props.parameters.name]);
  tableShow.value = true;
};

// 清空input框的值
const clearInputFn = (e: Event) => {
  if (props.parameters.updatedDisabled && props.modelValue.id) return;
  e.stopPropagation();
  clearRadioIdFn();
};

// 清空缓存的数据
const clearRadioIdFn = () => {
  computedValue.value[props.parameters.name] = [];
  delete computedValue.value[props.parameters.ids];
  modalTableIds.value = [];
};

// 确认按钮
const clickConfirm = () => {
  computedValue.value = modalTableList.value;
  tableShow.value = false;
};

// 关闭table弹窗
const closeDialog = () => {
  tableShow.value = false;
  originalData = computedValue.value;
  modalTableIds.value = originalData[props.parameters.ids];
  modalTableList.value = originalData[props.parameters.name];
};
</script>

<template>
  <a-form-item-rest>
    <a-popover
      v-if="
        computedValue[parameters.name] &&
        computedValue[parameters.name].length >= 3
      "
      placement="top"
      style="z-index: 10"
    >
      <template #content>
        <div style="width: 300px">
          {{
            arrDemotionValue(
              computedValue[parameters.name],
              parameters.nameValue
            )
          }}
        </div>
      </template>
      <a-input
        id="inputDom"
        :value="
          computedValue[parameters.name].length
            ? arrDemotionValue(
                computedValue[parameters.name],
                parameters.nameValue
              )
            : ''
        "
        :placeholder="`请选择${parameters.describe}`"
        :disabled="Boolean(parameters.updatedDisabled && props.modelValue.id)"
      >
        <template #suffix>
          <span
            class="suffix"
            v-if="!Boolean(parameters.updatedDisabled && props.modelValue.id)"
          ></span>
          <div
            :class="
              parameters.updatedDisabled && props.modelValue.id
                ? 'noDropMask'
                : 'mask'
            "
            @click="openTableFn()"
          >
            <close-circle-outlined @click.prevent="clearInputFn" />
          </div>
        </template>
      </a-input>
    </a-popover>
    <a-input
      v-else
      id="inputDom"
      :value="
        computedValue[parameters.name] && computedValue[parameters.name].length
          ? arrDemotionValue(
              computedValue[parameters.name],
              parameters.nameValue
            )
          : ''
      "
      :placeholder="`请选择${parameters.describe}`"
      :disabled="Boolean(parameters.updatedDisabled && props.modelValue.id)"
    >
      <template #suffix>
        <span
          class="suffix"
          v-if="!Boolean(parameters.updatedDisabled && props.modelValue.id)"
        ></span>
        <div
          v-if="
            !computedValue[parameters.name] ||
            (computedValue[parameters.name] &&
              computedValue[parameters.name].length < 3)
          "
          :class="
            parameters.updatedDisabled && props.modelValue.id
              ? 'noDropMask'
              : 'mask'
          "
          @click="openTableFn()"
        >
          <close-circle-outlined @click.prevent="clearInputFn" />
        </div>
      </template>
    </a-input>

    <!-- table弹窗 -->
    <a-modal
      style="width: 70%"
      centered
      v-model:open="tableShow"
      :title="parameters.describe"
      :bodyStyle="{ padding: 0 }"
      :destroyOnClose="true"
      @ok="clickConfirm"
      @cancel="closeDialog"
    >
      <!-- 表格部分 -->
      <TableModel :styleConfig="styleConfig"></TableModel>
    </a-modal>
  </a-form-item-rest>
</template>

<style lang="less" scoped>
#inputDom {
  position: relative;
}
.suffix {
  width: 12px;
  height: 18px;
  background-color: #fff;
}

.mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 32px;
  display: flex;
  justify-content: end;
  align-items: center;
  &:hover {
    cursor: pointer;
    background-color: #dddddd38;
  }

  .anticon-close-circle {
    margin-right: 10px;
    color: #81818138;
    font-size: 13px;
    z-index: 2;
    &:hover {
      cursor: pointer;
      color: rgba(0, 0, 0, 0.45) !important;
    }
  }
}

.noDropMask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 32px;
  display: flex;
  justify-content: end;
  align-items: center;
  &:hover {
    cursor: no-drop;
  }

  .anticon-close-circle {
    margin-right: 10px;
    color: #81818138;
    font-size: 13px;
    z-index: 2;
    &:hover {
      cursor: no-drop;
    }
  }
}
</style>
