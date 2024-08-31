export const setTableOption = (obj: any, type: string | null | undefined) => {
  const findIndex = obj.columns.findIndex(
    (val: any) => val.type === "radio" || val.type === "checkbox"
  );
  if (!type || findIndex !== -1) {
    obj.columns[findIndex].type = type;
  } else {
    obj.columns = [{ type: type, width: 50 }, ...obj.columns];
  }
  return obj;
};
