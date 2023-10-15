<script setup lang="ts">
import { ref, computed } from 'vue';
import { calendarEvent } from '../../type/event';
import { useEventStore } from '../../stores/calendarStore';
import EventDetailDialog from './EventDetailDialog.vue';

interface Props {
    calendarEventId: String,
    indentCount: number
}
const eventStore = useEventStore();

const props = defineProps<Props>();
const calendarEvent = ref(
    eventStore.calendarEvents.get(props.calendarEventId)
);
const openChildEventsListRef = ref(false);
const childEventsListSwitch = () => {
    openChildEventsListRef.value = !openChildEventsListRef.value;
}

const listItemStyle = computed(() => {
    return { '--indent-count': props.indentCount }
})

const showEventDetailDialogRef = ref(false);
const showEventDetailDialog = () => {
    showEventDetailDialogRef.value = true;
}
const closeEventDetailDialog = () => {
    showEventDetailDialogRef.value = false;
}
const stopEvent = () => {
    event?.stopPropagation();
}
</script>
<template>
    <span v-if="calendarEvent?.childEventIdList !== undefined && calendarEvent?.childEventIdList.length > 0">
        <button v-if="!openChildEventsListRef" @click="childEventsListSwitch">></button>
        <button v-else @click="childEventsListSwitch">v</button>
    </span>
    <span @click="showEventDetailDialog">{{ calendarEvent?.title }}</span>
    <div v-for="childEventId of calendarEvent?.childEventIdList">
        <div v-if="openChildEventsListRef" :style="listItemStyle" class="list-item">
            <ChildEventListItem :calendarEventId="childEventId" :indent-count="indentCount + 1" />
        </div>
    </div>
    <div v-if="showEventDetailDialogRef" @click.stop="closeEventDetailDialog" class="overlay overlay-event-detail">
        <div class="content content-event-detail" @click="stopEvent">
            <EventDetailDialog :calendarEvent="calendarEvent" @close-dialog="closeEventDetailDialog" />
        </div>
    </div>
</template>
<style scoped>
.list-item {
    margin-left: calc(50px * var(--indent-count));
}
</style>