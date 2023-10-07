<script setup lang="ts">
import { ref } from 'vue';
import { defaultEvent2 } from '../../type/event';
import EventDetailDialog from './EventDetailDialog.vue';
type calendarEvent = {
    id: string,
    title: string,
    startDate: Date,
    endDate: Date,
    memo?: string,
    children?: calendarEvent[]
}

const props = defineProps<{
    date: Number,
    calendarEvents?: Array<calendarEvent>,
}>();
const emits = defineEmits<{
    (e: 'showAddEventDialog'): void
}>();
const eventsRef = ref(props.calendarEvents);


const showAddButton = ref(false);
const addEventButtonMouseOver = () => {
    showAddButton.value = true;
}
const addEventButtonMouseLeave = () => {
    showAddButton.value = false;
}


const onClickAddButton = () => {
    emits('showAddEventDialog');
}
eventsRef.value = [defaultEvent2];
const showEventDetailRef = ref(false);

const showEventDetail = () => {
    showEventDetailRef.value = true;
}
const closeEventDetail = () => {
    showEventDetailRef.value = false;
}
const stopEvent = () => {
    event?.stopPropagation();
}
</script>

<template>
    <div class="one-day">
        <div class="date">
            {{ date }}
        </div>
        <div v-for="(event, index) of eventsRef" class="task">
            <input type="checkbox" :key="index">
            <label @click="showEventDetail">{{ event.title }}</label>
            <div v-if="showEventDetailRef" @click.stop="closeEventDetail" class="overlay overlay-event-detail">
                <div class="content content-event-detail" @click="stopEvent">
                    <EventDetailDialog :calendarEvent="event" @close-dialog="closeEventDetail" />
                </div>
            </div>
        </div>
        <div v-on:mouseover="addEventButtonMouseOver" v-on:mouseleave="addEventButtonMouseLeave"
            style="text-align: center;">
            <span v-if="showAddButton" @click="onClickAddButton"
                style="display: inline-block; width: 20x; height: 20px; border-radius: 50%; background: skyblue; text-align:center; line-height: 20px;">
                +
            </span>
            <span v-else>-</span>
        </div>
    </div>
</template>

<style scoped>
.one-day {
    color: white;
    border: 1px solid white;
    height: 100%;
    width: 100%;
}

.date {
    text-align: center;
    padding: 8px;
}

.task {
    background: #ce7169;
    border-radius: 4px;
    margin: 5px;
    min-height: 24px;
    max-height: 48px;
    opacity: 75%;
}

.task:hover {
    /* background-color: red; */
    opacity: 100%;
}

.overlay {
    /*　画面全体を覆う設定　*/
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);

    /*　画面の中央に要素を表示させる設定　*/
    display: flex;
    align-items: center;
    justify-content: center;

}

.content {
    max-width: 50%;
    max-height: 50%;
    background: #fff;
}

.overlay-event-detail {
    z-index: 1;
}

.content-event-detail {
    z-index: 2;
}
</style>