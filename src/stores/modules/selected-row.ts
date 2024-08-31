import _ from "lodash";
import { defineStore } from "pinia";
export const useSelectedRow = defineStore(
  "selected-row",
  () => {
    // 单选
    const radioId = shallowRef<number | undefined>(undefined);
    const radioData = shallowRef<Record<string, any>>({});
    const updateRadioData = (value: Record<string, any>) => {
      radioId.value = value.id;
      radioData.value = value;
    };

    // 多选
    const checkboxIds = shallowRef<(number | string | undefined)[]>([]);
    const checkboxList = shallowRef<Record<string, any>[]>([]);
    const updateCheckboxList = (value: Record<string, any>[]) => {
      checkboxIds.value = value.map((v) => v.id);
      checkboxList.value = value;
    };
    const clearCheckboxList = () => {
      checkboxIds.value = [];
      checkboxList.value = [];
    };

    // 弹窗表格多选缓存数组
    const modalTableIds = shallowRef<(number | string | undefined)[]>([]);
    const modalTableList = shallowRef<any>([]);

    // 设置初始数据
    const setOrginModalTable = (value: any) => {
      if (!value) return;
      let data: any;
      if (value instanceof Array) {
        data = value;
      } else if (value instanceof Object) {
        data = [value];
      }
      modalTableIds.value = data.map((v: any) => v.id);
      modalTableList.value = data;
    };
    const updateModalTableList = (
      newValues: Record<string, any>[],
      checked: boolean
    ) => {
      if (checked) {
        // 合并去重
        modalTableList.value = _.uniqBy(
          [...modalTableList.value, ...newValues],
          "id"
        );
        modalTableIds.value = modalTableList.value.map((v: any) => v.id);
      } else {
        modalTableList.value = newValues;
        modalTableIds.value = modalTableList.value.map((v: any) => v.id);
      }
    };

    return {
      radioId,
      radioData,
      updateRadioData,
      checkboxIds,
      checkboxList,
      updateCheckboxList,
      clearCheckboxList,
      modalTableIds,
      modalTableList,
      setOrginModalTable,
      updateModalTableList,
    };
  },
  {
    persist: {
      enabled: false, // true 表示开启持久化保存
    },
  }
);
