<script setup lang="ts">
import Pattern1Component from '../common/Pattern1Component.vue';
import CalendarTitleBar from './CalendarTitleBar.vue';
import CalenderBody from './CalendarBody.vue';
</script>

<template>
    <Pattern1Component>
        <template #titleBar>
            <CalendarTitleBar />
        </template>
        <template #body>
            <CalenderBody />
        </template>
    </Pattern1Component>
</template>

<style scoped></style>