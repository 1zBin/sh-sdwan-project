<script setup lang="ts">
import { createVNode } from "vue";
import {
  VxeTableEvents,
  VxePagerEvents,
  VxeGridListeners,
  VxePulldownInstance,
} from "vxe-table";
import { Modal } from "ant-design-vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { checkPermission } from "@/utils/checkPermission";
import { useSelectedRow } from "@/stores";
import { formatDate } from "@/utils/date";
import { setTableOption } from "~@/utils/tableConfig";
import _, { toNumber } from "lodash";

const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
    default: () => [],
  },
  tableConfig: {
    type: Object,
    default: () => {},
  },
  gridOptions: {
    type: Object,
    default: () => {},
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
  "update:modelValue",
  "handleTableChange",
  "handleAdd",
  "handleDelete",
  "handleDeletes",
  "handleEdit",
  "handleReset",
  "handleDetails",
  "handleAddson",
  "handleCopy",
  "handlePermission",
  "handleManage",
  "handleReplace",
  "setPermission",
  "changeContent",
  "handleMonitoring",
  "handleSettings",
  "handleDwonloadCrt",
  "handleBackup",
  "handleReboot",
  "handleReset",
  "handleShutdown",
  "handlePortList",
]);

const tableData = computed({
  get: () => props.modelValue,
  set: (val) => emits("update:modelValue", val),
});

// 表格配置项-初始化
const defaultColumnConfig = {
  resizable: true, // 每一列是否启用列宽调整
  isHover: true, // 当鼠标移到列头时，是否要高亮当前头
  isCurrent: true, // 当鼠标点击列头时，是否要高亮当前列
};
const defaultRowConfig = {
  keyField: "id", // 每行的标识
  useKey: true,
  isHover: true, // 当鼠标移到行时，是否要高亮当前行
};
const radioConfig = reactive<any>({
  trigger: props.styleConfig.type === "modalTable" ? "row" : null,
});
const checkboxConfig = reactive<any>({
  trigger: props.styleConfig.type === "modalTable" ? "row" : null,
  checkField: "checkField",
});

// 表格上的分页器属性配置
const pagerConfig: any = computed(() =>
  gridConfigs.value.pagerConfig &&
  gridConfigs.value.pagerConfig.enabled === false
    ? null
    : {
        total: props.pageData.total,
        currentPage: props.pageData.page,
        pageSize: props.pageData.pageSize,
        layouts: [
          "Sizes", // 每页条数
          // "PrevJump", // 跳转至第一页
          "PrevPage", // 上一页
          "Number", // 页数数字
          "NextPage", // 下一页
          // "NextJump", // 跳转至最后一页
          "FullJump", // 跳转至哪一页
          "Total", // 共几条记录
        ],
      }
);

const xTable = ref<any>();
const gridConfigs = ref<any>(_.cloneDeep(props.gridOptions));
const selectedRow = useSelectedRow();
const { checkboxIds, modalTableIds, modalTableList } = toRefs(selectedRow);
const modalArg =
  props.tableConfig && props.tableConfig.modalArguments
    ? props.tableConfig.modalArguments
    : {};
const dateKeys: string[] = [
  "CreatedAt",
  "UpdatedAt",
  "loginTime",
  "crtCreateAt",
  "crtExpireAt",
];

onMounted(() => {
  // 动态处理列的显示
  gridConfigs.value.columns = gridConfigs.value.columns.map((val: any) => {
    if (val.field === "action") {
      // 在弹窗表格里不需要显示操作那一列
      if (props.styleConfig.type === "modalTable") {
        val.visible = false;
      } else {
        val.visible = true;
      }
    }
    return val;
  });

  const $table = xTable.value;
  if (!$table) return;
  if (props.styleConfig.type === "modalTable") {
    // 重新赋值勾选类型(单选/多选)
    gridConfigs.value = setTableOption(
      gridConfigs.value,
      props.styleConfig.tableType
    );
    // 弹窗表格时隐藏工具栏
    $table.toolbarConfig.enabled = false;
    // 回显勾选状态
    echoCheckedsFn();
  } else {
    selectedRow.clearCheckboxList();
    // 页面初始化时判断一次
    isDisabled($table, checkboxIds.value);
  }
});

// 渲染初始化勾选状态的回显
const echoCheckedsFn = () => {
  if (props.styleConfig.tableType === "radio") {
    radioConfig["checkRowKey"] = `${modalTableIds.value[0]}`;
  } else {
    checkboxConfig["checkRowKeys"] = modalTableIds.value.map((num: number) =>
      num.toString()
    );
  }
};

// 顶部按钮事件
const gridEvents: VxeGridListeners<Record<string, object>> = {
  toolbarButtonClick(row) {
    const $table = xTable.value;
    if ($table) {
      switch (row.button.code) {
        case "add": {
          emits("handleAdd");
          break;
        }
        case "dels": {
          modalFunction(
            modalArg.delete.title,
            "handleDeletes",
            checkboxIds.value
          );
          break;
        }
        case "backup": {
          emits("handleBackup");
          break;
        }
      }
    }
  },
};

// 右侧操作按钮
const handleActionBtn = (record: Record<string, object>, key: string) => {
  if (key === "del") {
    modalFunction(modalArg.delete.title, "handleDelete", record);
  } else if (
    key === "reset" &&
    props.tableConfig.name !== "cpe-dev" &&
    props.tableConfig.name !== "pop-dev"
  ) {
    modalFunction(modalArg.reset.title, "handleReset", record);
  } else if (key === "restore") {
    modalFunction(modalArg.restore.title, "handleRestore", record);
  }

  const keys = [
    "edit",
    "addson",
    "permission",
    "copy",
    "manage",
    "replace",
    "details",
    "addCpe",
    "settings",
    "reboot",
    "reset",
    "shutdown",
    "portList",
  ];
  if (keys.includes(key)) {
    const emitsKey = `handle${capitalizeFirstLetter(key)}` as any;
    emits(emitsKey, record);
  }
};

// -------------下载证书-------------

const clickDwonloadCrt = (event: any) => {
  const num = toNumber(event.key);
  emits("handleDwonloadCrt", num);
};

// -------------下拉菜单-------------

interface ItemVO {
  label: string;
  value: string;
}
const pulldownRef = ref<VxePulldownInstance>();

//点击展开
const pulldownToggle = (index: number) => {
  nextTick(() => {
    const $pulldown: any = pulldownRef.value;
    if ($pulldown) {
      console.log("pulldownToggle", index, $pulldown[index]);

      $pulldown[index].togglePanel();
    }
  });
};

//点击选项
const selectItem = (
  record: Record<string, object>,
  item: ItemVO,
  index: number
) => {
  const $pulldown: any = pulldownRef.value;
  if ($pulldown) {
    console.log("selectItem", item, $pulldown);
    handleActionBtn(record, item.value);
    $pulldown[index].togglePanel();
  }
};

// 单选
const radioChangeEvent: VxeTableEvents.RadioChange<Record<string, object>> = ({
  row,
}) => {
  selectedRow.updateRadioData(row);
  if (props.styleConfig.type === "modalTable") {
    selectedRow.updateModalTableList([row], true);
  }
  console.log("单选事件", selectedRow.radioData, selectedRow.radioId);
};

// 复选
const selectChangeEvent: VxeTableEvents.CheckboxChange<
  Record<string, object>
> = ({ checked }) => {
  const $table = xTable.value;
  if ($table) {
    const records = $table.getCheckboxRecords();
    if (props.styleConfig.type === "modalTable") {
      if (checked) {
        selectedRow.updateModalTableList(records, checked);
      } else {
        // 先找出取消勾选的对象数组
        const cancelCheckeds = _.differenceBy(tableData.value, records, "id");
        const otherList = _.differenceBy(
          modalTableList.value,
          cancelCheckeds,
          "id"
        );
        selectedRow.updateModalTableList(otherList, checked);
      }
    } else {
      selectedRow.updateCheckboxList(records);
      isDisabled($table, checkboxIds.value);
    }
  }
};

// 全选
const selectAllChangeEvent: VxeTableEvents.CheckboxAll<
  Record<string, object>
> = ({ checked }) => {
  const $table = xTable.value;
  if ($table) {
    let records = $table.getCheckboxRecords();
    if (props.styleConfig.type === "modalTable") {
      if (checked) {
        selectedRow.updateModalTableList(tableData.value, checked);
      } else {
        const otherList = _.differenceBy(
          modalTableList.value,
          tableData.value,
          "id"
        );
        selectedRow.updateModalTableList(otherList, checked);
      }
    } else {
      selectedRow.updateCheckboxList(records);
      isDisabled($table, checkboxIds.value);
    }
  }
};

// 控制分页
const handlePageChange: VxePagerEvents.PageChange = ({
  currentPage,
  pageSize,
}) => {
  echoCheckedsFn();
  emits("handleTableChange", currentPage, pageSize);
};

/* ------------------------- 一些复用函数 -------------------------- */

// 判断多选框为空数组时，批量删除为禁用状态
const isDisabled = (document: any, ids: number[] | string[]) => {
  if (document && document.toolbarConfig && document.toolbarConfig.buttons) {
    let data = document.toolbarConfig.buttons.find(
      (val: any) => val.code === "dels"
    );
    if (!data) return;
    if (ids.length === 0) {
      data["disabled"] = true;
    } else {
      data["disabled"] = false;
    }
  }
};

// 将字符串首字母转成大写
const capitalizeFirstLetter = (str: any): any => {
  if (str.length === 0) {
    return str; // 空字符串则直接返回
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
};

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

// --------------------------

// 离开页面时清除一些缓存数据
onUnmounted(() => {
  selectedRow.updateCheckboxList([]);
  selectedRow.setOrginModalTable([]);
  localStorage.removeItem("VXE_TABLE_CUSTOM_COLUMN_VISIBLE");
});
</script>

<template>
  <a-card
    :bodyStyle="
      props.styleConfig.antCardStyle ? props.styleConfig.antCardStyle : {}
    "
  >
    <vxe-grid
      ref="xTable"
      round
      v-bind="gridConfigs"
      :data="tableData"
      :size="
        props.styleConfig && props.styleConfig.type === 'modalTable'
          ? props.styleConfig.size
          : 'middle'
      "
      :pager-config="
        gridConfigs.pagerConfig ? gridConfigs.pagerConfig : pagerConfig
      "
      :show-overflow="'tooltip'"
      :show-header-overflow="'tooltip'"
      :column-config="
        gridConfigs.columnConfig
          ? gridConfigs.columnConfig
          : defaultColumnConfig
      "
      :row-config="
        gridConfigs.rowConfig ? gridConfigs.rowConfig : defaultRowConfig
      "
      :radio-config="
        props.styleConfig.type === 'modalTable' ? radioConfig : null
      "
      :checkbox-config="
        props.styleConfig.type === 'modalTable' ? checkboxConfig : null
      "
      v-on="gridEvents"
      @radio-change="radioChangeEvent"
      @checkbox-all="selectAllChangeEvent"
      @checkbox-change="selectChangeEvent"
      @page-change="handlePageChange"
    >
      <!-- 右侧工具栏插槽 -->
      <template #toolbar_tools>
        <div mr-4>
          <a-dropdown>
            <template #overlay>
              <a-menu @click="clickDwonloadCrt">
                <a-menu-item key="1"> SDWan CA证书 </a-menu-item>
                <a-menu-item key="2"> SDWan 证书 </a-menu-item>
              </a-menu>
            </template>
            <a-button shape="round">
              下载证书
              <DownOutlined />
            </a-button>
          </a-dropdown>
        </div>
      </template>
      <template #name="{ row, column, rowIndex }">
        <!-- --------菜单-------- -->
        <template v-if="column.field === 'type'">
          <a-tag color="success">菜单</a-tag>
          <template v-if="row.menuBtn.length">
            <a-tag color="pink">按钮</a-tag>
          </template>
        </template>
        <template v-else-if="column.field === 'hidden'">
          <a-tag v-if="!row.hidden" color="success">显示</a-tag>
          <a-tag v-else color="default">隐藏</a-tag>
        </template>
        <!-- -----历史操作详情----- -->
        <template v-if="column.field === 'reqBody'">
          <a-popover placement="bottomRight" v-if="row.reqBody">
            <template #content>
              <a-card>
                <div v-html="row.reqBody"></div>
              </a-card>
            </template>
            <InfoCircleOutlined />
          </a-popover>
          <span v-else>无</span>
        </template>
        <template v-else-if="column.field === 'respBody'">
          <a-popover placement="bottomRight" v-if="row.respBody">
            <template #content>
              <a-card>
                <div v-html="row.respBody"></div>
              </a-card>
            </template>
            <InfoCircleOutlined />
          </a-popover>
          <span v-else>无</span>
        </template>
        <!-- ------登录日志------ -->
        <template v-else-if="column.field === 'msg'">
          <a-popover placement="topLeft" v-if="row.msg && row.msg.length > 20">
            <template #content>
              <div style="max-width: 300px !important">
                {{ row.msg }}
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
              {{ row.msg }}
            </div>
          </a-popover>
          <span v-else-if="row.msg && row.msg.length <= 20">{{ row.msg }}</span>
        </template>
        <!-- --------是否启用TLS-------- -->
        <template v-else-if="column.field === 'useTls'">
          <a-tag v-if="row.useTls === '1'" color="blue">启用</a-tag>
          <a-tag v-else color="default">不启用</a-tag>
        </template>
        <!-- --------是否启用TLS-------- -->
        <template v-else-if="column.field === 'disabled'">
          <span>{{ row.disabled === "yes" ? "是" : "否" }}</span>
        </template>
        <!-- --------操作-------- -->
        <!-- --------时间-------- -->
        <template v-else-if="dateKeys.includes(column.field)">
          <span>
            {{ formatDate(row[column.field]) }}
          </span>
        </template>
        <!-- --------备份-------- -->
        <template v-else-if="column.field === 'backupType'">
          <span v-if="row.backupType === '1'">自动备份</span>
          <span v-else-if="row.backupType === '2'">手动备份</span>
          <span v-else-if="row.backupType === '3'">配置变更备份</span>
          <span v-else-if="row.backupType === '4'">进行恢复时备份</span>
          <span v-else>--</span>
        </template>
        <!-- --------操作-------- -->
        <template v-else-if="column.field === 'action'">
          <div v-if="tableConfig.action" flex gap-2>
            <template
              v-for="action in tableConfig.action"
              :key="`${tableConfig.name}+${action.key}`"
            >
              <template v-if="action.key === 'operations'">
                <vxe-pulldown
                  size="small"
                  ref="pulldownRef"
                  destroy-on-close
                  :transfer="true"
                  v-if="checkPermission(action.permission)"
                >
                  <template #default>
                    <a :style="action.style" @click="pulldownToggle(rowIndex)">
                      {{ action.name }}
                    </a>
                    <DownOutlined
                      :style="{
                        color: action.style.color,
                        verticalAlign: 'middle',
                      }"
                    />
                  </template>
                  <template #dropdown>
                    <div class="my-dropdown">
                      <vxe-list
                        height="auto"
                        class="dropdown-list"
                        :data="action.options"
                        auto-resize
                      >
                        <template #default="{ items }">
                          <div
                            class="list-item"
                            v-for="item in items"
                            :key="item.value"
                            @click="selectItem(row, item, rowIndex)"
                          >
                            <span>{{ item.label }}</span>
                          </div>
                        </template>
                      </vxe-list>
                    </div>
                  </template>
                </vxe-pulldown>
              </template>
              <template v-else>
                <a
                  v-if="checkPermission(action.permission)"
                  :style="action.style"
                  @click="handleActionBtn(row, action.key)"
                >
                  {{ action.name }}
                </a>
              </template>
            </template>
          </div>
        </template>
      </template>
    </vxe-grid>
  </a-card>
</template>

<style lang="scss" scoped>
.dropdown-list {
  width: auto;
  box-shadow: 0 0 6px 2px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  border: 1px solid #dcdfe6;
}
.list-item {
  padding: 10px 10px 10px 10px;
}
.list-item:hover {
  cursor: pointer;
  border-radius: 5px;
  background-color: #f5f7fa;
}
</style>
