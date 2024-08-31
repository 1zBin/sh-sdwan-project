<script setup lang="ts">
import { message } from "ant-design-vue";
import { uploadFile } from "@/api/file/upload";

const emits = defineEmits(["uploadRes"]);

const previewVisible = ref(false);
const previewImage = ref("");
const previewTitle = ref("");
const fileList = ref<any>([]);

// 数据回显传参过来图片数据
const showImg = (data: any) => {
  fileList.value[0] = data;
};
// 每次关闭弹窗清空fileList
const remove = () => {
  fileList.value = [];
};

// 自定义上传图片函数
const customRequest = async (data: any) => {
  fileList.value[0].status = "done";
  const formData = new FormData();
  formData.append("file", data.file);
  formData.append("name", data.file.name);
  formData.append("size", data.file.size);

  const res = await uploadFile(formData);

  emits("uploadRes", res.data.data.file.url);
};

// 主动暴露remove, showImg方法
defineExpose({ remove, showImg, customRequest });

// 上传图片前对图片格式的校验
const beforeUpload = (file: File) => {
  fileList.value = [];
  const isJpgOrPng =
    file.type === "image/jpeg" ||
    file.type === "image/png" ||
    file.type === "image/jpg";
  if (!isJpgOrPng) {
    message.error("只能上传 JPG/PNG/JPEG 格式图片！");
  }
  const isLt2M = file.size / 1024 / 1024 < 10;
  if (!isLt2M) {
    message.error("Image 必须 10MB 以内!");
  }
  return isJpgOrPng && isLt2M;
};

function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

const handleCancel = () => {
  previewVisible.value = false;
  previewTitle.value = "";
};
const handlePreview = async (file: any) => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj);
    console.log("preview", file.preview);
  }
  previewImage.value = file.url || file.preview;
  previewVisible.value = true;
  previewTitle.value =
    file.name || file.url.substring(file.url.lastIndexOf("/") + 1);
};

const removePicture = () => {
  emits("uploadRes", "");
};
</script>

<template>
  <div>
    <a-upload
      v-model:file-list="fileList"
      :beforeUpload="beforeUpload"
      :customRequest="customRequest"
      list-type="picture-card"
      :show-upload-list="true"
      @preview="handlePreview"
      @remove="removePicture"
    >
      <div v-if="fileList.length < 1">
        <PlusOutlined />
        <div style="margin-top: 8px">Upload</div>
      </div>
    </a-upload>
    <a-modal
      :open="previewVisible"
      :title="previewTitle"
      :footer="null"
      @cancel="handleCancel"
    >
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>

<style>
/* you can make up upload button and sample style by using stylesheets */
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
