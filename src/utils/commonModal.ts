import { createVNode } from "vue";
import { Modal } from "ant-design-vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";

export const modalFunction = async (
  title: string,
  fnArgument: () => Promise<void>
) => {
  const modalRef = Modal.confirm({
    title: title,
    icon: createVNode(ExclamationCircleOutlined),
    okText: "确认",
    cancelText: "取消",
    async onOk() {
      modalRef.update({ confirmLoading: true }); // 设置确认按钮为加载状态

      try {
        await fnArgument();
      } catch (error) {
        console.error(error);
      } finally {
        modalRef.update({ confirmLoading: false }); // 恢复确认按钮为非加载状态
      }
    },
    onCancel() {
      return;
    },
    class: "test",
  }) as any;
};
