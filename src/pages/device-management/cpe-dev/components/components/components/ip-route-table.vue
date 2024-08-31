<script lang="ts" setup>
import { VxePagerEvents } from "vxe-table";
import { getIpRouteList } from "@/api/device/ipRoute.ts";
import emitter from "@/utils/eventbus";
import { CommonPageData } from "~@/types";

const props = defineProps({
  cpeId: {
    type: Number,
    required: true,
  },
  configBelong: {
    type: String,
    required: true,
  },
});

const tableData = ref<any>([]);
const columns = [
  {
    field: "dstAddress",
    title: "目标地址",
  },
  {
    field: "gateway",
    title: "网关",
  },
  {
    field: "distance",
    title: "管理距离",
  },
  {
    field: "disabled",
    title: "是否禁用",
    slots: { default: "name" },
  },
  {
    field: "comment",
    title: "备注",
  },
];
const gridConfigs = reactive({
  id: "dhcp-client",
  loading: false,
  columnConfig: {
    resizable: true, // 每一列是否启用列宽调整
  },
});

const pageData = ref<CommonPageData>({
  page: 1,
  pageSize: 10,
  total: 0,
  configBelong: props.configBelong,
  cpeDevID: props.cpeId,
});

const pagerConfig: any = computed(() => {
  return {
    total: pageData.value.total,
    currentPage: pageData.value.page,
    pageSize: pageData.value.pageSize,
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
  };
});

onMounted(() => {
  getAllIpRouteList();
});

const getAllIpRouteList = async () => {
  try {
    gridConfigs.loading = true;
    const res = await getIpRouteList(pageData.value);
    tableData.value = res.data.data.list;
    console.log("getIpRouteList", tableData.value);
    pageData.value.total = res.data.data.total;
    // 如果当前页面删除至没有数据(第一页除外)，则跳转到上一页
    if (
      pageData.value.page &&
      pageData.value.page > 1 &&
      tableData.value.length === 0
    ) {
      pageData.value.page = pageData.value.page - 1;
      getAllIpRouteList();
    }
    gridConfigs.loading = false;
  } catch (error) {
    gridConfigs.loading = false;
    console.log("error", error);
  }
};

// 分页跳转函数
const handleTableChange: VxePagerEvents.PageChange = ({
  currentPage,
  pageSize,
}) => {
  pageData.value.page = currentPage;
  pageData.value.pageSize = pageSize;
  getAllIpRouteList();
};

// 刷新表格
const refreshTableData = (types: string[] | undefined) => {
  if (types?.includes("ipRoute")) {
    getAllIpRouteList();
  }
};
emitter.on("refreshTableData", refreshTableData);
</script>

<template>
  <div>
    <vxe-grid
      ref="gridTable"
      round
      max-height="400"
      v-bind="gridConfigs"
      :data="tableData"
      :columns="columns"
      :show-overflow="'tooltip'"
      :show-header-overflow="'tooltip'"
      :pager-config="pagerConfig"
      @page-change="handleTableChange"
    >
      <template #name="{ row, column }">
        <template v-if="column.field === 'disabled'">
          <span v-if="row.disabled === 'yes'">是</span>
          <span v-else>否</span>
        </template>
      </template>
    </vxe-grid>
  </div>
</template>
