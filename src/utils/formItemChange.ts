import { uniqBy, differenceWith, isEqual } from "lodash-es";

// 二维数组转一维 -- ids
export const arrDemotionIds = (arr: any) => {
  let list = arr.reduce((a: any, b: any) => {
    return a.concat(b);
  });
  if (typeof list[0] === "object") {
    list = uniqBy(list, "id");
  }
  return list;
};
// 二维数组转字符串 -- 用于显示名称
export const arrDemotionValue = (arr: any, key: any) => {
  let array = arr.map((val: any) => val[`${key}`]);
  array = array.toString().replace(/,/g, "  ");
  return array;
};

// ids数据处理函数
export const idsChangeFn = (arr: any, array: any, delId: any) => {
  let list = [...new Set(arr.concat(array))];
  if (delId) {
    list = differenceWith(list, delId, isEqual); //保留不同部分
  }
  return list;
};
// 勾选回显name处理函数
export const nameShowFn = (arr: any, array: any, rows: any) => {
  let list = arr.concat(array);
  list = list.filter((v: any) => v);
  list = uniqBy(list, "id"); // 根据键名属性去重
  if (rows && rows[0].id) {
    rows.forEach((value: any) => {
      list = list.filter((val: any) => val.id != value.id);
    });
  }
  return list;
};

// 编辑弹窗添加name子表单项
export const setFormConfig = (obj: any) => {
  let nameIndex = obj.formItems.findIndex((v: any) => v.name === "name");
  let belongToIndex = obj.formItems.findIndex(
    (v: any) => v.name === "belongTo"
  );
  if (nameIndex === -1) {
    obj.formItems.splice(belongToIndex, 0, {
      name: "name",
      type: "input",
      label: "名称",
      placeholder: "请输入名称",
    });
  }
  return obj;
};
