<script lang="ts">
import icons from "./icons.json";
export default defineComponent({
  name: "IconPicker",
  props: {
    icon: {
      type: String,
      required: true,
    },
    //自定义触发方式
    trigger: {
      type: String as PropType<"click" | "hover" | "focus" | "contextmenu">,
      default: "click",
      validator: function (value: string) {
        return ["click", "hover", "focus", "contextmenu"].indexOf(value) !== -1;
      },
    },
  },
  setup(_props, context) {
    const iconArr = ref<string[]>(icons);
    const visible = ref<boolean>(false);
    const searchValue = ref("");

    const handleClick = (icon: string) => {
      context.emit("update:icon", icon);
      visible.value = false;
    };

    /**
     * 进行搜索过滤
     */
    const filterIcon = () => {
      if (searchValue.value) {
        iconArr.value = icons.filter((item) =>
          item.toLowerCase().includes(searchValue.value.toLowerCase())
        );
      } else {
        iconArr.value = icons;
      }
    };

    watch(
      () => visible.value,
      () => {
        if (visible.value) {
          searchValue.value = "";
          iconArr.value = icons;
        }
      }
    );

    return {
      visible,
      iconArr,
      handleClick,
      searchValue,
      filterIcon,
    };
  },
});
</script>

<template>
  <a-form-item-rest>
    <a-popover
      placement="bottom"
      v-model:open="visible"
      :trigger="trigger"
      :overlayClassName="`icon-popover`"
      :overlayStyle="{ width: '100%' }"
      :destroyTooltipOnHide="true"
    >
      <template #title>
        <a-input-search
          v-model:value="searchValue"
          placeholder="输入英文关键词进行搜索"
          @change="filterIcon"
        />
      </template>

      <template #content>
        <div class="icon-box">
          <div
            v-for="(item, index) in iconArr"
            :key="index"
            @click="handleClick(item)"
            class="icon-content"
            :style="icon === item ? { background: '#f50', color: '#fff' } : {}"
          >
            <component :is="$antIcons[item]" />
          </div>
        </div>
      </template>
      <slot name="iconSelect"></slot>
    </a-popover>
  </a-form-item-rest>
</template>

<style scoped>
.icon-box {
  overflow-y: auto;
  font-size: 20px;
  width: 100%;
  height: 200px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-content: flex-start;
  justify-content: center;
}

.icon-content {
  width: 45px;
  height: 40px;
  margin: 5px;
  cursor: pointer;
  border-radius: 6px;
  border: 1px solid #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon-content:hover {
  background: #1890ff;
}
</style>
