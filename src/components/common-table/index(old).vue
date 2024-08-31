<script setup lang="ts">
import { checkPermission } from "@/utils/checkPermission";
// import { formatDate } from "@/utils/date";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import type { TablePaginationConfig, TableProps } from "ant-design-vue";
import { Modal } from "ant-design-vue";
import cloneDeep from "lodash-es/cloneDeep";
import { computed, createVNode } from "vue";
import { useRoute } from "vue-router";

const props = defineProps({
  tableConfig: {
    type: Object,
    default: () => {},
  },
  tableData: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  pageData: {
    type: Object,
    default: () => {},
    required: false,
  },
  styleConfig: {
    type: Object,
    required: false,
    default: () => ({}),
  },
  delsChecked: {
    type: Array,
    required: false,
    default: () => [],
  },
});

const emits = defineEmits([
  "handleTableChange",
  "handleAdd",
  "handleDelete",
  "handleDeletes",
  "handleEdit",
  "handleReset",
  "handleAddSon",
  "handleManage",
  "handleReplace",
  "setPermission",
  "changeContent",
  "handleMonitoring",
]);

onMounted(() => {
  // 表格单选组件关联Ids数组回显
  if (
    props.styleConfig.tableType === "radio" &&
    radioId.value &&
    radioId.value.length
  ) {
    state.selectedRowKeys = radioId.value;
  }
  // 表格多选组件关联Ids数组回显
  else if (
    props.styleConfig.tableType === "checkbox" &&
    checkboxIds.value &&
    checkboxIds.value.length
  ) {
    state.selectedRowKeys = checkboxIds.value;
  }
});

const route = useRoute();
// 多选框/单选框
const state = reactive({
  selectedRowKeys: [] as any,
  selectedRowData: [] as any,
});
const { selectedRowKeys } = toRefs(state);
const modalArg = props.tableConfig.modalArguments;

// const dateKeys: string[] = [
//   "CreatedAt",
//   "UpdatedAt",
//   "loginTime",
//   "crtCreateAt",
//   "crtExpireAt",
// ];

// 处理columns的action那里是否显示
const columnsFn = (columns: any) => {
  let list = columns;
  if (props.styleConfig.delAction) {
    list = columns.filter((v: any) => v.key !== "action");
  } else {
    list = columns;
  }
  return list;
};

// 表格上的分页器属性配置
const pagination = computed(() => ({
  simple: props.styleConfig.size === "small" ? true : false,
  total: props.pageData.total,
  current: props.pageData.page,
  pageSize: props.pageData.pageSize,
  pageSizeOptions: getNumbers(props.pageData.total),
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `总数：${total}`,
}));

// 更新分页
const handleTableChange = (page: TablePaginationConfig) => {
  emits("handleTableChange", page);
};

// 行内编辑的input框失焦逻辑
const handleBlur = (record: any) => {
  if (!isClickIcon.value) {
    record["crtValue"] = cloneDeep(record.crtName);
    record.crtName = record.originName;
    record.isEdit = false;
  }
};

const isClickIcon = ref(false);
// 行内编辑
const changeContent = (
  event: Event,
  record: any,
  index: number,
  key: string
) => {
  event.stopPropagation();
  const targetElement = event.target as HTMLElement;

  // 检查点击的元素以及其父元素是否符合预期
  if (
    targetElement.tagName === "svg" || // 如果点击的是 svg 标签
    targetElement.tagName === "path" || // 如果点击的是 path 标签
    targetElement.className.includes("editIcon") // 如果点击的是图标类名
  ) {
    record.isEdit = true;
    const doms = document.querySelectorAll(".editInput");
    const antInputElement = doms[index].querySelector(
      ".ant-input-borderless"
    ) as HTMLInputElement | null;
    nextTick(() => {
      antInputElement?.focus();
    });
  } else if (
    targetElement.tagName === "DIV" &&
    targetElement.className.includes("editBox")
  ) {
    record.crtName = record["crtValue"];
    emits("changeContent", record, key);
  }
};

// 表格上方按钮
const handleTopBtn = (key: string) => {
  if (key === "add") {
    emits("handleAdd");
  } else if (key === "dels") {
    modalFunction(
      modalArg.delete.title,
      "handleDeletes",
      state.selectedRowKeys
    );
  }
};

// 将字符串首字母转成大写
const capitalizeFirstLetter = (str: any): any => {
  if (str.length === 0) {
    return str; // 空字符串则直接返回
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// 操作按钮
const handleActionBtn = (record: Record<string, object>, key: string) => {
  if (key === "del") {
    modalFunction(modalArg.delete.title, "handleDelete", record);
  } else if (key === "reset") {
    modalFunction(modalArg.reset.title, "handleReset", record);
  }

  const keys = ["edit", "addson", "permission", "copy", "manage", "replace"];
  if (keys.includes(key)) {
    const emitsKey = `handle${capitalizeFirstLetter(key)}` as any;
    emits(emitsKey, record);
  }
};

// 监控
const handleMonitoring = (record: Record<string, any>) => {
  emits("handleMonitoring", record);
};

// 计算分页数组的辅助函数
const getNumbers = (num: number) => {
  if (num < 10) {
    return ["5", "10"];
  } else {
    const base = Math.floor(num / 10);
    const result = [];

    for (let i = 1; i <= base; i++) {
      result.push((i * 10).toString());
    }
    return result;
  }
};

// 表格左上角的新增和批量删除按钮
const disabledBtn = (name: string) => {
  let value = false;
  if (name === "批量删除" && state.selectedRowKeys.length === 0) {
    value = true;
  }
  return value;
};

// 单选-表格组件
const radioId: any =
  props.styleConfig.tableType === "radio" ? inject("radioId") : [];
const getRadioData: any =
  props.styleConfig.tableType === "radio" ? inject("getRadioData") : [];
// 表格单选change事件:分页、排序、筛选变化时触发
const onChangeRowFn = (
  selectedRowKeys: number[] | string[],
  selectedRows: Record<string, any>[]
) => {
  console.log("onChangeRowFn", selectedRowKeys, selectedRows);
  // 单选时传递机柜ID
  if (props.styleConfig.tableType === "radio") {
    radioId.value = selectedRowKeys;
    getRadioData(selectedRows);
  }
  state.selectedRowKeys = selectedRowKeys;
};

// 多选-表格组件
const checkboxIds: any =
  props.styleConfig.tableType === "checkbox" ? inject("checkboxIds") : [];
const getCheckboxIds: any =
  props.styleConfig.tableType === "checkbox" ? inject("getCheckboxIds") : [];
const getCheckboxData: any =
  props.styleConfig.tableType === "checkbox" ? inject("getCheckboxData") : [];

const onSelectRowFn = (
  record: Record<string, any>,
  selected: Boolean,
  selectedRows: Record<string, any>[]
) => {
  // if (!state.selectedRowKeys) state.selectedRowKeys = [];
  if (props.styleConfig.tableType === "checkbox") {
    let selectedArr = selectedRows.filter((v) => v);
    let selectedIds = selectedArr.map((val) => val.id);
    state.selectedRowKeys = checkboxIds.value;
    if (selected) {
      getCheckboxIds(selectedIds, props.pageData.page);
      getCheckboxData(selectedArr, props.pageData.page);
      state.selectedRowKeys.push(record.id);
    } else {
      getCheckboxIds(selectedIds, props.pageData.page, [record.id]);
      getCheckboxData(selectedArr, props.pageData.page, [record]);
      state.selectedRowKeys = state.selectedRowKeys.filter(
        (val: any) => val != record.id
      );
    }
  }
};

const onSelectAllFn = (
  selected: Boolean,
  selectedRows: Record<string, any>[],
  changeRows: Record<string, any>[]
) => {
  if (props.styleConfig.tableType === "checkbox") {
    let selectedArr = selectedRows.filter((v) => v);
    let selectedIds = selectedArr.map((val) => val.id);
    let delIds = changeRows.map((val) => val.id);
    if (selected) {
      getCheckboxIds(selectedIds, props.pageData.page);
      getCheckboxData(selectedArr, props.pageData.page);
      state.selectedRowKeys = [
        ...new Set(state.selectedRowKeys.concat(selectedIds)),
      ];
    } else {
      getCheckboxIds(selectedIds, props.pageData.page, delIds);
      getCheckboxData(selectedArr, props.pageData.page, changeRows);
      let list: any[] = [];
      delIds.forEach((value) => {
        list = state.selectedRowKeys.filter((val: any) => val.id != value.id);
      });
      state.selectedRowKeys = list;
    }
  }
};

// 点击行属性-单击勾选
const loadCustomRow = (record: Record<string, any>) => {
  return {
    onClick: () => {
      // updateSelectedRowKeys为是否禁用点击
      if (!props.styleConfig.updateSelectedRowKeys) {
        let ids: number[] | string[] = [record.id];
        if (props.styleConfig.tableType === "radio") {
          state.selectedRowKeys = ids;
          getRadioData([record]);
        } else if (props.styleConfig.tableType === "checkbox") {
          if (state.selectedRowKeys.includes(record.id)) {
            state.selectedRowKeys = state.selectedRowKeys.filter(
              (v: any) => v !== record.id
            );
            if (state.selectedRowKeys.length) {
              state.selectedRowKeys.forEach((value: any) => {
                state.selectedRowData = props.tableData.filter(
                  (v: any) => v.id === value
                );
              });
            } else {
              state.selectedRowData = [];
            }
            onSelectRowFn(record, false, state.selectedRowData);
          } else {
            state.selectedRowData = [];
            state.selectedRowKeys = state.selectedRowKeys.concat(ids);
            state.selectedRowKeys.forEach((value: any) => {
              state.selectedRowData = state.selectedRowData.concat(
                props.tableData.filter((v: any) => v.id === value)
              );
            });
            onSelectRowFn(record, true, state.selectedRowData);
          }
        }
      }
    },
  };
};

// 用户状态switch开关按钮
// const changeSwitchFn = (
//   checked: boolean | string | number,
//   record: Record<string, any>,
//   column: any
// ) => {
//   modalFunction(
//     modalArg.switch.title,
//     "changeSwitchFn",
//     record,
//     checked,
//     column
//   );
// };

// Modal.method() 简洁弹窗函数
const modalFunction = (
  title: string,
  emitName: any,
  data: any,
  checked?: boolean | string | number,
  column?: any
) => {
  Modal.confirm({
    title: title,
    icon: createVNode(ExclamationCircleOutlined),
    okText: "确认",
    cancelText: "取消",
    onOk() {
      emits(emitName, data);
    },
    onCancel() {
      console.log("Cancel", checked, column);
      if (emitName === "changeSwitchFn" && column.key) {
        let status = [column.checkedValue, column.unCheckedValue];
        let filterValue = status.filter((val) => val !== checked);
        data[column.key] = filterValue[0];
      }
    },
    class: "test",
  });
};
</script>

<template>
  <a-card :bodyStyle="styleConfig.antCardStyle ? styleConfig.antCardStyle : {}">
    <div
      w-full
      mb-4
      flex
      justify-start
      v-if="styleConfig.topBtnShow === 'hidden' ? false : true"
    >
      <a-button
        mr-4
        v-for="btn in tableConfig.button"
        :key="btn.key"
        :size="styleConfig.size ? styleConfig.size : 'middle'"
        :type="btn.type"
        :danger="btn.danger"
        :disabled="disabledBtn(btn.name)"
        @click="handleTopBtn(btn.key)"
        >{{ btn.name }}</a-button
      >
    </div>
    <a-table
      rowKey="id"
      :loading="loading"
      :size="styleConfig.size ? styleConfig.size : 'default'"
      :columns="(columnsFn(tableConfig.columns) as TableProps['columns'])"
      :scroll="tableConfig.scroll"
      :data-source="tableData"
      :pagination="pageData ? pagination : { hideOnSinglePage: true }"
      :customRow="loadCustomRow"
      :row-selection="
        tableConfig.rowSelection && !styleConfig.delRowSelection
          ? {
              selectedRowKeys: selectedRowKeys,
              onChange: onChangeRowFn,
              onSelect: onSelectRowFn,
              onSelectAll: onSelectAllFn,
              type: styleConfig.tableType
                ? styleConfig.tableType
                : tableConfig.rowSelection.type
            }
          : null as any
      "
      @change="handleTableChange"
    >
      <template #bodyCell="{ text, record, index, column }">
        <!-- --------用户-------- -->
        <template v-if="column.key === 'enable'">
          <!-- <a-switch
            :disabled="!checkPermission(tableConfig.enablePermission)"
            v-model:checked="record.enable"
            :checkedValue="column.checkedValue"
            :unCheckedValue="column.unCheckedValue"
            @change="changeSwitchFn($event, record, column)"
          /> -->
        </template>
        <!-- --------菜单-------- -->
        <template v-if="column.key === 'type' && tableConfig.name === 'menu'">
          <a-tag color="success">菜单</a-tag>
          <template v-if="record.menuBtn.length">
            <a-tag color="pink">按钮</a-tag>
          </template>
        </template>
        <template v-if="column.key === 'hidden'">
          <a-tag v-if="!record.hidden" color="success">显示</a-tag>
          <a-tag v-else color="default">隐藏</a-tag>
        </template>
        <template v-if="column.key === 'is_ssl' || column.key === 'websocket'">
          <a-tag v-if="!record.hidden" color="success">启用</a-tag>
          <a-tag v-else color="default">未启用</a-tag>
        </template>
        <!-- -----历史操作详情----- -->
        <template v-if="column.key === 'reqBody'">
          <a-popover placement="bottomRight" v-if="record.reqBody">
            <template #content>
              <a-card>
                <div v-html="record.reqBody"></div>
              </a-card>
            </template>
            <InfoCircleOutlined />
          </a-popover>
          <span v-else>无</span>
        </template>
        <template v-else-if="column.key === 'respBody'">
          <a-popover placement="bottomRight" v-if="record.respBody">
            <template #content>
              <a-card>
                <div v-html="record.respBody"></div>
              </a-card>
            </template>
            <InfoCircleOutlined />
          </a-popover>
          <span v-else>无</span>
        </template>
        <!-- ------登录日志------ -->
        <template v-else-if="column.key === 'msg'">
          <a-popover
            placement="topLeft"
            v-if="record.msg && record.msg.length > 20"
          >
            <template #content>
              <div style="max-width: 300px !important">
                {{ record.msg }}
              </div>
            </template>
            <div
              style="
                max-width: 200px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              "
            >
              {{ record.msg }}
            </div>
          </a-popover>
          <span v-else-if="record.msg && record.msg.length <= 20">{{
            record.msg
          }}</span>
        </template>
        <!-- --------行内编辑-------- -->
        <template v-else-if="column.key === 'crtName'">
          <span v-if="route.fullPath !== '/slbs/certificate'">{{ text }}</span>
          <div
            v-else
            class="editBox"
            @click="changeContent($event, record, index, column.key)"
          >
            <div
              v-show="!record.isEdit"
              style="padding: 4px 11px"
              flex
              justify-between
            >
              <div>{{ record.crtName }}</div>
              <a-tooltip title="修改证书名称">
                <FormOutlined class="editIcon" />
              </a-tooltip>
            </div>
            <div v-show="record.isEdit">
              <a-input
                class="editInput"
                v-model:value.trim="record.crtName"
                :bordered="false"
                @blur="handleBlur(record)"
                @press-enter="changeContent($event, record, index, column.key)"
              >
                <template #suffix>
                  <CheckOutlined class="editIcon" />
                </template>
              </a-input>
            </div>
          </div>
        </template>
        <!-- --------监控-------- -->
        <template v-else-if="column.key === 'monitoring'">
          <FundViewOutlined @click="handleMonitoring(record)" />
        </template>
        <!-- --------时间-------- -->
        <!-- <template v-else-if="dateKeys.includes(column.key)">
          <span>
            {{ formatDate(text) }}
          </span>
        </template> -->
        <!-- --------操作-------- -->
        <template v-else-if="column.key === 'action'">
          <div v-if="tableConfig.action" flex gap-2>
            <template
              v-for="action in tableConfig.action"
              :key="`${tableConfig.name}+${action.key}`"
            >
              <a
                v-if="checkPermission(action.permission)"
                :style="action.style"
                @click="handleActionBtn(record, action.key)"
              >
                {{ action.name }}
              </a>
            </template>
          </div>
        </template>
      </template>
    </a-table>
  </a-card>
</template>

<style scoped lang="less">
:deep(.editInput) {
  height: 30px;
  .ant-input-borderless {
    border-bottom: 1px solid #c1c1c1;
  }
}

.editIcon {
  color: var(--text-color-2);
  &:hover {
    cursor: pointer;
    color: var(--text-color-1);
  }
}
</style>
