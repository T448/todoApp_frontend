<script setup lang="ts">
import { ref, computed } from 'vue';
import { calendarEvent } from '../../type/event';


interface Props {
    calendarEvent: calendarEvent,
    indentCount: number
}

const props = defineProps<Props>();
const calendarEvent = ref(props.calendarEvent);
const openChildEventsListRef = ref(false);
const childEventsListSwitch = () => {
    openChildEventsListRef.value = !openChildEventsListRef.value;
}

const listItemStyle = computed(() => {
    return { '--indent-count': props.indentCount }
})

</script>
<template>
    <span v-if="calendarEvent.children !== undefined && calendarEvent.children.length > 0">
        <button v-if="!openChildEventsListRef" @click="childEventsListSwitch">></button>
        <button v-else @click="childEventsListSwitch">v</button>
    </span>
    {{ calendarEvent.title }}
    <div v-for="childEvent of calendarEvent.children">
        <div v-if="openChildEventsListRef" :style="listItemStyle" class="list-item">
            <ChildEventListItem :calendarEvent="childEvent" :indent-count="indentCount + 1" />
        </div>
    </div>
</template>
<style scoped>
.list-item {
    margin-left: calc(50px * var(--indent-count));
}
</style>