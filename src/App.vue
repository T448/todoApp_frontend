<script setup lang="ts">
// Components
import OuterFrame from './components/OuterFrame.vue';
import SideMenuContents from './components/SideMenuContents.vue';

import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const isLogin = computed(() => router.currentRoute.value.path !== "/app");
</script>

<template>
  <template v-if="isLogin">
    <OuterFrame>
      <template #sideBarContents>
        <SideMenuContents />
      </template>
      <template #mainContents>
        <router-view />
      </template>
    </outerFrame>
  </template>
  <template v-else>
    <router-view />
  </template>
</template>