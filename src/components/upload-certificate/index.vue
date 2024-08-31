<template>
  <!-- 上传文件 -->
  <a-upload
    name="file"
    v-model:file-list="fileList"
    :multiple="true"
    :showUploadList="false"
    :beforeUpload="beforeUpload"
    :customRequest="customRequest"
  >
    <button ref="uploadRef" style="display: none"></button>
  </a-upload>
</template>

<script setup lang="ts">
import { message } from "ant-design-vue";

const props = defineProps({
  spinning: {
    type: Boolean,
    default: false,
  },
  fileType: {
    type: String,
    default: "",
  },
});

const emits = defineEmits(["update:spinning", "renderContents"]);
const isSpinning = computed({
  get: () => props.spinning,
  set: (val) => emits("update:spinning", val),
});

const fileList = ref([]);
const uploadRef = ref(null);
defineExpose({ uploadRef });
// 自定义上传
const customRequest = async (data: any) => {
  isSpinning.value = true;
  const file = data.file; // 获取上传的证书文件
  const reader = new FileReader();

  reader.onload = (e: any) => {
    const contents = e.target.result; // 获取证书文件内容
    emits("renderContents", props.fileType, contents);
    isSpinning.value = false;
  };

  // 以文本形式读取文件内容
  reader.readAsText(file);
};

// 上传文件前对文件大小限制
const beforeUpload = (file: any) => {
  fileList.value = [];
  const isLt50M = file.size / 1024 / 1024 < 50;
  if (!isLt50M) {
    message.error("文件必须50MB以内!超过上限请联系管理员!");
  }
  return isLt50M;
};
</script>

<style lang="less" scoped>
.uploadButtun {
  padding: 10px;
}
</style>
