<script setup lang="ts">
import { Ref, ref, watch } from 'vue';
import { calendarEventBase, defaultEvent00 } from '../../type/event';
import { dateTimeConverter } from '../../modules/dateTimeConverter';
import ChildEventListItem from './ChildEventListItem.vue';
import AddEventDialog from './AddEventDialog.vue';
import { MdEditor, MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { updateEvent, updateEventRequest, deleteEvents } from '../../modules/eventAPI';
import { useEventStore } from '../../stores/calendarStore';
import { useMemoTemplateStore } from '../../stores/memoTemplateStore';

interface Props {
    calendarEvent: calendarEventBase;
}

const eventStore = useEventStore();
const memoTemplateStore = useMemoTemplateStore();

const props = withDefaults(defineProps<Props>(), { calendarEvent: () => defaultEvent00 });

const emits = defineEmits<{
    (e: 'closeDialog'): void
}>();
const close = () => {
    emits('closeDialog');
}
const eventTitle = ref(props.calendarEvent.title);
const memo = ref(props.calendarEvent.memo);
const startDate = ref(dateTimeConverter(props.calendarEvent.startDate));
const endDate = ref(dateTimeConverter(props.calendarEvent.endDate));
const startDateTime = ref(dateTimeConverter(props.calendarEvent.startDateTime));
const endDateTime = ref(dateTimeConverter(props.calendarEvent.endDateTime));
const childEventIdList = ref(props.calendarEvent.childEventIdList);
const projectId = ref(props.calendarEvent.projectId);
const projectColor = ref(props.calendarEvent.projectColor);
const projectName = ref(props.calendarEvent.projectName);
const showAddEventDialogRef = ref(false);
const eventId = ref(props.calendarEvent.id);

const eventTitleBeforeEdit = ref("");
const startDateBeforeEdit: Ref<String | null> = ref("");
const endDateBeforeEdit: Ref<String | null> = ref("");
const startDateTimeBeforeEdit: Ref<String | null> = ref("");
const endDateTimeBeforeEdit: Ref<String | null> = ref("");
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
    startDateBeforeEdit.value = startDate.value;
    endDateBeforeEdit.value = endDate.value;
    startDateTimeBeforeEdit.value = startDateTime.value;
    endDateTimeBeforeEdit.value = endDateTime.value;
    memoBeforeEdit.value = memo.value;
}
const finishEdit = () => {
    editModeRef.value = false;

    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const request: updateEventRequest = {
        eventId: eventId.value,
        name: eventTitle.value,
        memo: memo.value,
        projectId: projectId.value,
        startDate: startDate.value ?? "",
        endDate: endDate.value ?? "",
        startDateTime: startDateTime.value ?? "",
        endDateTime: endDateTime.value ?? "",
        timeZone: tz ?? ""
    }
    updateEvent(request);
}
const cancelEdit = () => {
    eventTitle.value = eventTitleBeforeEdit.value;
    startDate.value = startDateBeforeEdit.value;
    endDate.value = endDateBeforeEdit.value;
    startDateTime.value = startDateTimeBeforeEdit.value;
    endDateTime.value = endDateTimeBeforeEdit.value;
    memo.value = memoBeforeEdit.value;
    editModeRef.value = false;
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

const selectedTemplateId = ref('');
watch(selectedTemplateId, () => {
    if (memoTemplateStore.template.has(selectedTemplateId.value)) {
        const appliedMemoTemplate = memoTemplateStore.template.get(selectedTemplateId.value);
        if (appliedMemoTemplate !== undefined) {
            memo.value = appliedMemoTemplate.template;
        }
    }
})

const isAllDay = ref(startDate.value !== null);
</script>


<template>
    <div class="dialog">
        <div>
            <div class="text" v-bind:style="{ background: projectColor }">
                <span v-if="!editModeRef">{{ eventTitle }}</span>
                <textarea v-if="editModeRef" v-model="eventTitle"></textarea>
            </div>
            <div class="text">
                <span v-if="editModeRef">終日</span>
                <input v-if="editModeRef" v-model="isAllDay" type="checkbox">
            </div>
            <div class="text">
                <span>開始 : </span>
                <span v-if="!editModeRef && isAllDay && startDate !== null">{{ startDate.replace("T", " ") }}</span>
                <input v-if="editModeRef && isAllDay" v-model="startDate" type="date">
                <span v-if="!editModeRef && !isAllDay && startDateTime !== null">{{ startDateTime.replace("T", " ")
                }}</span>
                <input v-if="editModeRef && !isAllDay" v-model="startDateTime" type="datetime-local">
            </div>
            <div class="text">
                <span>終了 : </span>
                <span v-if="!editModeRef && isAllDay && endDate !== null">{{ endDate.replace("T", " ") }}</span>
                <input v-if="editModeRef && isAllDay" v-model="endDate" type="date">
                <span v-if="!editModeRef && !isAllDay && endDateTime !== null">{{ endDateTime.replace("T", " ") }}</span>
                <input v-if="editModeRef && !isAllDay" v-model="endDateTime" type="datetime-local">
            </div>
            <div>
                <div v-if="editModeRef">
                    <select v-model="selectedTemplateId">
                        <option v-for="template of memoTemplateStore.template.values()" :value="template.id">{{
                            template.name }}</option>
                    </select>
                    <MdEditor v-model="memo" theme="dark" language="en-US" />
                </div>
                <div v-if="!editModeRef">
                    <MdPreview v-model="memo" theme="dark" language="en-US" />
                </div>
            </div>
        </div>
        <div>
            <!-- TODO : クリックで子タスクの詳細に飛べるようにする -->
            <!-- TODO : 子タスクの一覧を出すトグルボタンをつける -->
            <div v-if="childEventIdList !== undefined && childEventIdList.length > 0" class="text">子イベント</div>
            <div v-for="childEventId of childEventIdList">
                <ChildEventListItem :calendar-event-id="childEventId" :indent-count="1" />
            </div>
        </div>
        <div>
            <!-- <button @click="emits('showAddEventDialog')">子タスクを追加</button> -->
            <button v-if="!editModeRef" @click="showAddEventDialog">子イベント追加</button>
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
textarea {
    width: 90%;
    margin-top: 10px;
    background-color: #202124;
    color: white;
}

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