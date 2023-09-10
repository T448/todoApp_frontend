<script setup lang="ts">
import Pattern1Component from './common/Pattern1Component.vue';
import ModeSelector from './common/ModeSelector.vue';
import CalendarBody from './calendar/CalendarBody.vue';
</script>

<template>
    <!-- <div style="font-size: 32px;color: red;top:0;bottom: 0;right: 0;left: 0;margin:auto;">
        プロジェクトを選択してください。
    </div> -->
    <Pattern1Component>
        <template #titleBar>
            <ModeSelector />
        </template>
        <template #body>
            <CalendarBody />
        </template>
    </Pattern1Component>
</template>

<style scoped></style>