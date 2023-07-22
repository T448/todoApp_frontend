<script setup lang="ts">
import outerFrame from './outerFrame.vue';
</script>

<template>
    <outerFrame v-slot:contents>
        <div style="font-size: 32px;color: white;top:0;bottom: 0;right: 0;left: 0;margin:auto;">
            プロジェクトを選択してください。
        </div>
    </outerFrame>
</template>

<style scoped></style>