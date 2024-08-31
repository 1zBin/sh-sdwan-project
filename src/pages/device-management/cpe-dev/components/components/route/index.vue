<script setup lang="ts">
import RouteTable from "./route-table/index.vue";
const props = defineProps({
  cpeId: {
    type: Number,
    required: true,
  },
});

const tableActiveKey = ref("Lan");
const options = [
  {
    value: "Lan",
    label: "LAN",
  },
  {
    value: "Wan",
    label: "WAN",
  },
  {
    value: "Bus",
    label: "业务",
  },
];
</script>

<template>
  <a-tabs v-model:activeKey="tableActiveKey" :tab-position="'left'" animated>
    <a-tab-pane v-for="val in options" :key="val.value" :tab="val.label"
      ><RouteTable :cpeId="props.cpeId" :configBelong="val.value"
    /></a-tab-pane>
  </a-tabs>
</template>

<style scoped></style>
