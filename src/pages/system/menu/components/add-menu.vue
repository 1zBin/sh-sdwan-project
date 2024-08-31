<script setup lang="ts">
import { createBaseMenu, updateBaseMenu } from "@/api/system/menu";
import { deepSearch } from "@/utils/recursion";
import type { TableProps, TreeSelectProps } from "ant-design-vue";
import { Form } from "ant-design-vue";
import { cloneDeep } from "lodash";
import { formDataConfig } from "../config/form.config";

const props = defineProps({
  showDialog: {
    type: Boolean,
    default: false,
  },
  treeData: {
    type: Array,
    required: true,
  },
});
const emits = defineEmits(["update:showDialog", "refreshList"]);

const isShowDialog = computed({
  get: () => props.showDialog,
  set: (val) => emits("update:showDialog", val),
});
// table组件的格式
const columns = [
  {
    title: "按钮名称",
    dataIndex: "name",
    key: "name",
    align: "left",
  },
  {
    title: "按钮备注",
    dataIndex: "desc",
    key: "desc",
    align: "left",
  },
  {
    title: "操作",
    key: "action",
    align: "left",
    width: 100,
  },
];
const modalBodyStyle: any = {
  padding: "24px 48px 2px 24px",
  maxHeight: "80vh",
  overflowY: "auto",
};
const confirmLoading = ref(false);
const commonFormRef = ref<any>(null);
const menuBtndata = ref<any>([]);
const searchValue = ref("");
const selectValue = ref("顶级菜单");
const fieldNames = reactive({
  children: "children",
  label: "title",
  value: "title",
});
const treeSelectFn = (value: any, node: any) => {
  console.log("treeSelectFn", value, node);
  if (value) {
    if (value === "顶级菜单") {
      formData.value.parentId = "0";
    } else {
      formData.value.parentId = `${node.id}`;
    }
  }
};

const initValues = reactive<Record<string, any>>({
  id: 0,
  name: "",
  authorityIds: [],
  hidden: false,
  menuBtn: [],
  meta: {},
  icon: "",
  title: "",
  parameters: [],
  parentId: "0",
  path: "",
  sort: undefined,
  component: "",
});
const formData = ref(initValues);
const { resetFields } = Form.useForm(formData);

const addShow = (data: Record<string, any>) => {
  selectValue.value = data.meta?.title;
  if (data.id) {
    formData.value.parentId = `${data.id}`;
  }
};
const editShow = async (data: Record<string, any>) => {
  data.component = data.component.split("pages/").join("");
  data.component = data.component.split(".vue").join("");
  data["icon"] = data.meta.icon;
  Object.keys(formData.value).forEach((key) => {
    if (data[key]) formData.value[key] = data[key];
  });

  formData.value = data;
  formData.value["title"] = data.meta?.title;
  menuBtndata.value = data.menuBtn.map((val: any, index: number) => {
    val.key = index;
    return val;
  });

  // 调用查找父级元素的递归函数
  const treeData = cloneDeep(props.treeData);
  selectValue.value = deepSearch(treeData, data.parentId);
  console.log("编辑弹窗", data, treeData, selectValue.value);
};
// 主动暴露editShow方法
defineExpose({ addShow, editShow });

const count = computed(() => menuBtndata.value.length + 1);
const editableData = reactive<any>({});
const edit = (key: string) => {
  editableData[key] = cloneDeep(
    menuBtndata.value.filter((item: any) => key === item.key)[0]
  );
};
const save = (key: string) => {
  Object.assign(
    menuBtndata.value.filter((item: any) => key === item.key)[0],
    editableData[key]
  );
  delete editableData[key];
};
const onDelete = (key: string) => {
  menuBtndata.value = menuBtndata.value.filter((item: any) => item.key !== key);
};
const handleAdd = () => {
  const newData = {
    key: `${count.value}`,
    name: "",
    desc: "",
  };
  menuBtndata.value.push(newData);
};

// 确认提交表单数据
const clickConfirm = async () => {
  try {
    await commonFormRef.value.formRef.validateFields();
    const submitData = JSON.parse(JSON.stringify(formData.value));
    submitData["menuBtn"] = menuBtndata.value;
    submitData.meta.title = submitData.title;
    submitData.meta.icon = submitData.icon;
    submitData.component = "pages/" + submitData.component + ".vue";

    let result;
    confirmLoading.value = true;
    if (formData.value.id) {
      result = await updateBaseMenu(submitData);
    } else {
      delete submitData["id"];
      result = await createBaseMenu(submitData);
    }

    confirmLoading.value = false;
    if (result?.data.code === 2000) {
      // window.location.reload();
      clickCancel();
    }
  } catch (error) {
    confirmLoading.value = false;
    console.log("表单校验错误", error);
  }
};

// 关闭弹窗
const clickCancel = () => {
  formData.value["title"] = "";
  menuBtndata.value = [];
  selectValue.value = "顶级菜单";
  // 清空表单校验
  resetFields();
  emits("refreshList"); // 更新数据
  emits("update:showDialog", false);
};
</script>

<template>
  <a-modal
    width="60%"
    centered
    :title="
      formData.id ? `编辑${formDataConfig.name}` : `新增${formDataConfig.name}`
    "
    v-model:open="isShowDialog"
    :confirm-loading="confirmLoading"
    :bodyStyle="modalBodyStyle"
    :destroyOnClose="true"
    @ok="clickConfirm"
    @cancel="clickCancel"
  >
    <CommonForm ref="commonFormRef" v-model="formData" v-bind="formDataConfig">
      <template #formSlot_1>
        <a-tree-select
          v-model:value="selectValue"
          v-model:searchValue="searchValue"
          treeDefaultExpandAll
          show-search
          style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          placeholder="请选择父级菜单"
          allow-clear
          :tree-data="(treeData as TreeSelectProps['treeData'])"
          :fieldNames="fieldNames"
          @select="treeSelectFn"
        >
          <template #title="{ title }">
            <template v-if="title">
              <template
                v-for="(fragment, i) in title
                  .toString()
                  .split(
                    new RegExp(`(?<=${searchValue})|(?=${searchValue})`, 'i')
                  )"
              >
                <span
                  v-if="fragment.toLowerCase() === searchValue.toLowerCase()"
                  :key="i"
                  style="color: #08c"
                >
                  {{ fragment }}
                </span>
                <template v-else>{{ fragment }}</template>
              </template>
            </template>
          </template>
        </a-tree-select>
      </template>
      <template #formSlot_2>
        <a-form-item-rest>
          <div class="addBtnBox">
            <a-button
              type="primary"
              style="margin-bottom: 10px"
              @click="handleAdd()"
              >新增可控按钮</a-button
            >
            <a-table
              :columns="(columns as TableProps['columns'])"
              :data-source="menuBtndata"
              :pagination="{ hideOnSinglePage: true }"
              :locale="{ emptyText: '暂无数据' }"
              style="width: 100%"
              size="small"
            >
              <template #bodyCell="{ column, text, record }">
                <template v-if="column.key === 'name'">
                  <div class="editable-cell">
                    <div
                      v-if="editableData[record.key]"
                      class="editable-cell-input-wrapper"
                    >
                      <a-input
                        v-model:value.trim="editableData[record.key].name"
                        @pressEnter="save(record.key)"
                      />
                    </div>
                    <div v-else class="editable-cell-text-wrapper">
                      {{ text || " " }}
                    </div>
                  </div>
                </template>
                <template v-if="column.key === 'desc'">
                  <div class="editable-cell">
                    <div
                      v-if="editableData[record.key]"
                      class="editable-cell-input-wrapper"
                    >
                      <a-input
                        v-model:value="editableData[record.key].desc"
                        @pressEnter="save(record.key)"
                      />
                    </div>
                    <div v-else class="editable-cell-text-wrapper">
                      {{ text || " " }}
                    </div>
                  </div>
                </template>

                <template v-if="column.key === 'action'">
                  <div style="display: flex">
                    <div>
                      <div
                        v-if="editableData[record.key]"
                        class="editable-cell-input-wrapper"
                      >
                        <CheckOutlined
                          class="editable-cell-icon-check"
                          @click="save(record.key)"
                        />
                      </div>
                      <div v-else class="editable-cell-text-wrapper">
                        <EditOutlined
                          class="editable-cell-icon"
                          @click="edit(record.key)"
                        />
                      </div>
                    </div>
                    <a-divider style="align-self: center" type="vertical" />
                    <a-popconfirm
                      v-if="menuBtndata.length"
                      title="是否删除此可控按钮?"
                      @confirm="onDelete(record.key)"
                    >
                      <a style="color: rgb(245 108 108)">删除</a>
                    </a-popconfirm>
                  </div>
                </template>
              </template>
            </a-table>
          </div>
        </a-form-item-rest>
      </template>
      <template #formSlot_3>
        <IconPicker v-model:icon="formData.icon">
          <template #iconSelect>
            <a-input v-model:value="formData.icon">
              <template #prefix>
                <component :is="$antIcons[formData.icon]" />
              </template>
            </a-input>
          </template>
        </IconPicker>
      </template>
    </CommonForm>
  </a-modal>
</template>

<style scoped lang="less">
.editable-cell {
  position: relative;
  .editable-cell-input-wrapper,
  .editable-cell-text-wrapper {
    .ant-input {
      height: 22px;
    }
  }
  .editable-cell-icon,
  .editable-cell-icon-check {
    position: absolute;
    right: 0;
    width: 20px;
    cursor: pointer;
  }

  .editable-cell-icon {
    margin-top: 4px;
    display: none;
  }

  .editable-cell-icon-check {
    line-height: 28px;
  }

  .editable-cell-icon:hover,
  .editable-cell-icon-check:hover {
    color: #108ee9;
  }

  .editable-add-btn {
    margin-bottom: 8px;
  }
}
.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}

:deep(.ant-popconfirm) {
  width: 200px !important;
}
</style>
