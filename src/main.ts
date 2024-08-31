import { createApp } from "vue";
import App from "./App.vue";

import router from "@/router";
import "@/router/router-guard";

import { createPinia } from "pinia";
import piniaPersist from "pinia-plugin-persist";

import "uno.css";
import "@/assets/styles/reset.css";

import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";
import * as antIcons from "@ant-design/icons-vue";

import {
  // https://vxetable.cn/#/table/start/use
  // 全局对象
  VxeTable,

  // 表格功能
  Filter,
  Edit,
  Menu,
  Export,
  Keyboard,
  Validator,

  // 可选组件
  Icon,
  Column,
  // Colgroup,
  Grid,
  Tooltip,
  Toolbar,
  Pager,
  // Form,
  // FormItem,
  // FormGather,
  // Checkbox,
  // CheckboxGroup,
  // Radio,
  // RadioGroup,
  // RadioButton,
  // Switch,
  // Input,
  Select,
  // Optgroup,
  // Option,
  // Textarea,
  Button,
  Modal,
  List,
  Pulldown,
  // 表格
  Table,
} from "vxe-table";
import "vxe-table/lib/style.css";

function useTable(app: any) {
  // 表格功能
  app.use(Filter).use(Edit).use(Menu).use(Export).use(Keyboard).use(Validator);

  // 可选组件
  app
    .use(VxeTable)
    .use(Icon)
    .use(Column)
    // .use(Colgroup)
    .use(Grid)
    .use(Tooltip)
    .use(Toolbar)
    .use(Pager)
    // .use(Form)
    // .use(FormItem)
    // .use(FormGather)
    // .use(Checkbox)
    // .use(CheckboxGroup)
    // .use(Radio)
    // .use(RadioGroup)
    // .use(RadioButton)
    // .use(Switch)
    // .use(Input)
    .use(Select)
    // .use(Optgroup)
    // .use(Option)
    // .use(Textarea)
    .use(Button)
    .use(Modal)
    .use(List)
    .use(Pulldown)

    // 安装表格
    .use(Table);
}

const app = createApp(App);

Object.keys(antIcons).forEach((key) => {
  // @ts-ignore
  app.component(key, antIcons[key]);
});
// 添加到全局
app.config.globalProperties.$antIcons = antIcons;

declare module "vue" {
  export interface ComponentCustomProperties {
    $antIcons: any;
  }
}

const pinia = createPinia();
pinia.use(piniaPersist);
app.use(pinia);
app.use(router);
app.use(Antd);
app.use(useTable);
app.mount("#app");
