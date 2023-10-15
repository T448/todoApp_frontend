<script setup lang="ts">
import { ref } from 'vue';
import { calendarEventBase, defaultEvent00 } from '../../type/event';
import { dateTimeConverter } from '../../modules/dateTimeConverter';
import ChildEventListItem from './ChildEventListItem.vue';
import AddEventDialog from './AddEventDialog.vue';

interface Props {
    calendarEvent: calendarEventBase;
}

const props = withDefaults(defineProps<Props>(), { calendarEvent: () => defaultEvent00 });

const emits = defineEmits<{
    (e: 'closeDialog'): void
}>();
const close = () => {
    emits('closeDialog');
}
const eventTitle = ref(props.calendarEvent.title);
const memo = ref(props.calendarEvent.memo);
const start = ref(new Date(props.calendarEvent.start));
const end = ref(new Date(props.calendarEvent.end));
const childEventIdList = ref(props.calendarEvent.childEventIdList);
const projectId = ref(props.calendarEvent.projectId);
const projectColor = ref(props.calendarEvent.projectColor);
const projectName = ref(props.calendarEvent.projectName);
const showAddEventDialogRef = ref(false);
const eventId = ref(props.calendarEvent.id);

const showAddEventDialog = () => {
    showAddEventDialogRef.value = true;
};
const closeAddEventDialog = () => {
    showAddEventDialogRef.value = false;
}
const stopEvent = () => {
    event?.stopPropagation();
}
document.addEventListener('keydown', e => {
    if (e.key === "Escape") {
        closeAddEventDialog();
    }
})
</script>


<template>
    <div class="dialog">
        <div>
            <div class="text" v-bind:style="{ background: projectColor }">{{ eventTitle }}</div>
            <div class="text">{{ dateTimeConverter(start) }}</div>
            <div class="text">{{ dateTimeConverter(end) }}</div>
            <div class="text">{{ memo }}</div>
        </div>
        <div>
            <!-- TODO : クリックで子タスクの詳細に飛べるようにする -->
            <!-- TODO : 子タスクの一覧を出すトグルボタンをつける -->
            <div v-if="childEventIdList !== undefined && childEventIdList.length > 0" class="text">子タスク</div>
            <div v-for="childEventId of childEventIdList">
                <ChildEventListItem :calendar-event-id="childEventId" :indent-count="1" />
            </div>
        </div>
        <div>
            <!-- <button @click="emits('showAddEventDialog')">子タスクを追加</button> -->
            <button @click="showAddEventDialog">子タスクを追加</button>
            <button @click="close">閉じる</button>
        </div>
    </div>
    <div v-if="showAddEventDialogRef" @click.stop="closeAddEventDialog" class="overlay overlay-add-event">
        <div class="content content-add-event" @click="stopEvent">
            <AddEventDialog @close-dialog="closeAddEventDialog" :parent-event-project-id="projectId"
                :parent-event-project-name="projectName" :parent-event-project-color="projectColor"
                :parent-event-id="eventId" />
        </div>
    </div>
</template>

<style scoped>
.dialog {
    text-align: center;
    background-color: #35363a;
    width: 400px;
    min-height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

button {
    width: 120px;
}

.text {
    background-color: #1e1e1e;
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

.overlay-add-event {
    z-index: 3
}

.content-add-event {
    z-index: 4;
}
</style>