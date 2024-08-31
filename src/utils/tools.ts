/**
 * @description: 生成随机数
 * @param {Number} length
 * @return {String}
 */
export const randomBytes = (length: number) => {
  const values = new Uint8Array(length);
  window.crypto.getRandomValues(values);
  return Array.from(values)
    .map((byte) => String.fromCharCode(byte))
    .join("")
    .replace(/[^\w]/g, ""); // 删除非字母数字字符
};

// ----------------------------------------------------------------

/**
 * @description: 删除对象指定键名
 * @param {Object} obj
 * @param {Array} delKeys
 * @param {Array} excludeKeys
 * @return {Object}
 */
export const removeKeys = (
  obj: any,
  delKeys: string[],
  excludeKeys?: string[]
) => {
  if (typeof obj !== "object" || obj === null) return; // 如果不是对象或者为 null，直接返回
  if (Array.isArray(obj)) {
    // 如果是数组，遍历数组递归调用 removeKeys
    for (let i = 0; i < obj.length; i++) {
      removeKeys(obj[i], delKeys);
    }
  } else {
    // 如果是对象，遍历对象的所有属性递归调用 removeKeys
    for (let key in obj) {
      if (delKeys.includes(key) || obj[key] === null) {
        // 如果属性名在待删除的数组中，删除该属性
        if (excludeKeys?.includes(key)) {
          return;
        } else {
          delete obj[key];
        }
      } else {
        removeKeys(obj[key], delKeys); // 递归调用 removeKeys
      }
    }
  }
  return obj;
};

// ----------------------------------------------------------------
