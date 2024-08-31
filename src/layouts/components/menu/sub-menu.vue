<script setup lang="ts">
import { isUrl } from "@v-c/utils";
import type { MenuDataItem } from "~@/layouts/basic-layout/typing";
import AsyncIcon from "./async-icon.vue";
defineProps<{ item: MenuDataItem }>();
</script>

<template>
  <!-- 有子菜单的情况 -->
  <template v-if="item.children && !item.hideChildrenInMenu">
    <a-sub-menu :key="item.path">
      <template v-if="item.icon" #icon>
        <AsyncIcon :icon="item.icon" />
      </template>
      <template #title>
        {{ item.title }}
      </template>
      <template v-for="menu in item.children">
        <template v-if="!menu.hideInMenu">
          <!-- 组件递归实现N层菜单 -->
          <template v-if="menu.children">
            <sub-menu :key="menu.path" :item="menu" />
          </template>
          <template v-else>
            <a-menu-item :key="menu.path">
              <template v-if="menu.icon" #icon>
                <AsyncIcon :icon="menu.icon" />
              </template>
              <template v-if="!isUrl(menu.path)">
                <RouterLink :to="menu.path">
                  {{ menu.title }}
                </RouterLink>
              </template>
              <template v-else>
                <a :href="menu.path" :target="menu.target ?? '_blank'">
                  {{ menu.title }}
                </a>
              </template>
            </a-menu-item>
          </template>
        </template>
      </template>
    </a-sub-menu>
  </template>
  <!-- 无子菜单的情况 -->
  <template v-else>
    <a-menu-item :key="item.path">
      <template v-if="item.icon" #icon>
        <AsyncIcon :icon="item.icon" />
      </template>
      <!-- 如果不是网站则正常路由跳转 -->
      <template v-if="!isUrl(item.path)">
        <RouterLink :to="item.path">
          {{ item.title }}
        </RouterLink>
      </template>
      <!-- path是网址的话就跳转网址 -->
      <template v-else>
        <a :href="item.path" :target="item.target ?? '_blank'">
          {{ item.title }}
        </a>
      </template>
    </a-menu-item>
  </template>
</template>
