<script setup lang="ts">
import { ref } from 'vue';
import { calendarEventBase, defaultEvent00 } from '../../type/event';
import { dateTimeConverter } from '../../modules/dateTimeConverter';
import ChildEventListItem from './ChildEventListItem.vue';
import AddEventDialog from './AddEventDialog.vue';
import { MdEditor, MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { updateEvent, updateEventRequest, deleteEvents } from '../../modules/eventAPI';
import { useEventStore } from '../../stores/calendarStore';

interface Props {
    calendarEvent: calendarEventBase;
}

const eventStore = useEventStore();

const props = withDefaults(defineProps<Props>(), { calendarEvent: () => defaultEvent00 });

const emits = defineEmits<{
    (e: 'closeDialog'): void
}>();
const close = () => {
    emits('closeDialog');
}
const eventTitle = ref(props.calendarEvent.title);
const memo = ref(props.calendarEvent.memo);
const start = ref(dateTimeConverter(props.calendarEvent.start));
const end = ref(dateTimeConverter(props.calendarEvent.end));
const childEventIdList = ref(props.calendarEvent.childEventIdList);
const projectId = ref(props.calendarEvent.projectId);
const projectColor = ref(props.calendarEvent.projectColor);
const projectName = ref(props.calendarEvent.projectName);
const showAddEventDialogRef = ref(false);
const eventId = ref(props.calendarEvent.id);

const eventTitleBeforeEdit = ref("");
const startBeforeEdit = ref("");
const endBeforeEdit = ref("");
const memoBeforeEdit = ref("");

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

const editModeRef = ref(false);
const go2editMode = () => {
    editModeRef.value = true;
    eventTitleBeforeEdit.value = eventTitle.value;
    startBeforeEdit.value = start.value;
    endBeforeEdit.value = end.value;
    memoBeforeEdit.value = memo.value;
}
const finishEdit = () => {
    editModeRef.value = false;
    const request: updateEventRequest = {
        eventId: eventId.value,
        name: eventTitle.value,
        memo: memo.value,
        projectId: projectId.value,
        startDateTime: start.value,
        endDateTime: end.value,
        timeZone: 'Asia/Tokyo'
    }
    updateEvent(request);
}
const cancelEdit = () => {
    eventTitle.value = eventTitleBeforeEdit.value;
    start.value = startBeforeEdit.value;
    end.value = endBeforeEdit.value;
    memo.value = memoBeforeEdit.value;
    finishEdit();
}

const deleteEvent = () => {
    deleteEvents(projectId.value, getDeepChildEventIdList(props.calendarEvent.id));
    close();
}

const getDeepChildEventIdList = (id: string) => {
    // key:eventId,value:layer
    const childEventIdMap: Map<string, number> = new Map();
    const getChildEventIdMap = (id: string, childEventIdMap: Map<string, number>, layer: number) => {
        const targetEvent = eventStore.calendarEvents.get(id);
        if (targetEvent !== undefined) {
            childEventIdMap.set(id, layer);
            if (targetEvent.childEventIdList.length > 0) {
                targetEvent.childEventIdList.forEach(childEventId => {
                    getChildEventIdMap(childEventId, childEventIdMap, layer + 1);
                })
            }
        }
    }
    getChildEventIdMap(id, childEventIdMap, 0);
    return Array.from((new Map([...childEventIdMap].sort((a, b) => b[1] - a[1]))).keys());
}
</script>


<template>
    <div class="dialog">
        <div>
            <div class="text" v-bind:style="{ background: projectColor }">
                <span v-if="!editModeRef">{{ eventTitle }}</span>
                <textarea v-if="editModeRef" v-model="eventTitle"></textarea>
            </div>
            <div class="text">
                <span>開始 : </span>
                <span v-if="!editModeRef">{{ start.replace("T", " ") }}</span>
                <input v-if="editModeRef" v-model="start" type="datetime-local">
            </div>
            <div class="text">
                <span>終了 : </span>
                <span v-if="!editModeRef">{{ end.replace("T", " ") }}</span>
                <input v-if="editModeRef" v-model="end" type="datetime-local">
            </div>
            <div style="max-height: 400px;overflow-y: auto;">
                <MdEditor v-if="editModeRef" v-model="memo" theme="dark" language="en-US" />
                <MdPreview v-if="!editModeRef" v-model="memo" theme="dark" language="en-US" />
            </div>
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
            <button v-if="!editModeRef" @click="showAddEventDialog">子タスクを追加</button>
            <button v-if="!editModeRef" @click="go2editMode">編集</button>
            <button v-if="editModeRef" @click="finishEdit">完了</button>
            <button v-if="!editModeRef" @click="deleteEvent">削除</button>
            <button v-if="editModeRef" @click="cancelEdit">キャンセル</button>
            <button v-if="!editModeRef" @click="close">閉じる</button>
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
    width: 1200px;
    height: 600px;
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