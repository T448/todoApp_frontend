<script setup lang="ts">
import { computed, ref } from 'vue';
import EventDetailDialog from './EventDetailDialog.vue';
import { calendarEventBase } from '../../type/event';
import AddEventDialog from './AddEventDialog.vue';

// 日付の配列の作成
type ymd = {
    year: number,
    month: number,
    date: number
}

const props = defineProps<{
    date: ymd,
    calendarEvents?: Array<calendarEventBase>,
}>();

const eventsRef = computed(() => props.calendarEvents);
const ymdStr = computed(() => {
    const yearStr = String(props.date.year);
    let monthStr = "";
    if (props.date.month < 9) {
        monthStr = "0" + String(props.date.month + 1);
    } else {
        monthStr = String(props.date.month + 1);
    }
    let dateStr = "";
    if (props.date.date < 9) {
        dateStr = "0" + String(props.date.date);
    } else {
        dateStr = String(props.date.date);
    }
    return yearStr + "-" + monthStr + "-" + dateStr;
});

const showAddButton = ref(false);
const addEventButtonMouseOver = () => {
    showAddButton.value = true;
}
const addEventButtonMouseLeave = () => {
    showAddButton.value = false;
}


const showAddEventDialogRef = ref(false);

const showAddEventDialog = () => {
    showAddEventDialogRef.value = true;
};
const closeAddEventDialog = () => {
    showAddEventDialogRef.value = false;
}
// eventsRef.value = [defaultEvent2];
const showEventDetailRef = ref(false);

const showEventDetail = () => {
    console.log('showEventDetail');
    showEventDetailRef.value = true;
}
const closeEventDetail = () => {
    console.log('closeEventDetail');
    showEventDetailRef.value = false;
}
const stopEvent = () => {
    event?.stopPropagation();
}
document.addEventListener('keydown', e => {
    if (e.key === "Escape") {
        if (showAddEventDialogRef.value) {
            closeAddEventDialog();
        }
        if (showEventDetailRef) {
            closeEventDetail();
        }
    }
})
</script>

<template>
    <div class="one-day">
        <div class="date">
            {{ date.date }}
        </div>
        <div v-for="(event, index) of eventsRef" class="task" v-bind:style="{ backgroundColor: event.projectColor }">
            <input type="checkbox" :key="index">
            <label @click="showEventDetail" class="event-label">{{ event.shortTitle }}</label>
            <div v-if="showEventDetailRef" @click.stop="closeEventDetail" class="overlay overlay-event-detail">
                <div class="content content-event-detail" @click="stopEvent">
                    <EventDetailDialog :calendarEvent="event" @close-dialog="closeEventDetail" />
                </div>
            </div>
        </div>
        <div v-on:mouseover="addEventButtonMouseOver" v-on:mouseleave="addEventButtonMouseLeave"
            style="text-align: center;">
            <span v-if="showAddButton" @click="showAddEventDialog"
                style="display: inline-block; width: 20x; height: 20px; border-radius: 50%; background: skyblue; text-align:center; line-height: 20px;">
                +
            </span>
            <span v-else>-</span>
        </div>
        <div v-if="showAddEventDialogRef" @click.stop="closeAddEventDialog" class="overlay overlay-add-event">
            <div class="content content-add-event" @click="stopEvent">
                <AddEventDialog @close-dialog="closeAddEventDialog" :is-child-event="false" :start="ymdStr" />
            </div>
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
    /* background: #ce7169; */
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

.overlay-add-event {
    z-index: 1;
}

.content-add-event {
    z-index: 2;
}
</style>