<script setup lang="ts">
import { Ref, computed, ref, watch } from 'vue';
import { useProjectStore } from '../../stores/projectStore';
import { getCookies } from "typescript-cookie";
import axios from "axios";
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { useMemoTemplateStore } from '../../stores/memoTemplateStore';

type project = {
    id: string,
    name: string,
    memo: string,
    color: string,
    email: string,
    createdAt: Date,
    updatedAt: Date
}

const projectStore = useProjectStore();
const projectList = computed(() => {
    return Array.from(projectStore.projects.values());
})
const memoTemplateStore = useMemoTemplateStore();

const props = defineProps<{
    parentEventProjectId?: String,
    parentEventProjectName?: String,
    parentEventProjectColor?: String,
    parentEventId?: String,
    start?: String
}>();

const emits = defineEmits<{
    (e: 'closeDialog'): void
}>();
const cancel = () => {
    emits('closeDialog');
}
const eventTitle: Ref<string | number | string[] | undefined> = ref();
// const memo: Ref<string | number | string[] | undefined> = ref();
const memo = ref('# Plan\n- \n# Do\n- \n# Check\n- \n# Action\n- \n');
const isAllDay = ref(true);
const startDate: Ref<String | undefined> = ref(props.start);
const startDatetimeLocal: Ref<String | undefined> = ref(props.start + "T00:00");
const endDate: Ref<Date | undefined> = ref();
const endDatetimeLocal: Ref<Date | undefined> = ref();


const parentEventProjectIdRef = ref(props.parentEventProjectId);
const parentEventProjectNameRef = ref(props.parentEventProjectName);
const parentEventProjectColorRef: Ref<String | undefined> = ref(props.parentEventProjectColor);
const parentEventIdRef = ref(props.parentEventId);
// NOTE : 親イベントがないときのデフォルト値として設定している。
// 親イベントがあるときに誤って使用しないように。
const selectedProject: Ref<project | undefined> = ref(projectStore.generalProject);
const selectedProjectColor = computed(() => {
    if (selectedProject.value !== undefined) {
        return selectedProject.value.color;
    } else {
        return "#000000";
    }
})
console.log("parentEventProjectRef.value");
console.log(props.parentEventProjectColor);
const addEvent = () => {
    console.log('startDate');
    console.log(startDate.value);
    let projectId = "";
    if (parentEventProjectIdRef.value) {
        console.log("親イベントあり");
        projectId = parentEventProjectIdRef.value.toString();
    } else if (selectedProject.value?.id) {
        console.log("親イベントなし");
        projectId = selectedProject.value?.id;
    } else {
        alert("イベント追加に失敗");
        return;
    }
    let start: String | undefined;
    let end: String | undefined;
    if (isAllDay.value) {
        start = startDate.value + "T0:00:00";
        end = endDate.value + "T23:59:59";
    } else {
        if (startDatetimeLocal.value !== undefined) {
            start = startDatetimeLocal.value.toString() + ":00";
            end = endDatetimeLocal.value?.toString() + ":59";
        }
    }
    let parentEventId = "";
    if (parentEventIdRef.value) {
        parentEventId = parentEventIdRef.value.toString();
    }
    console.log("start");
    console.log(start);
    console.log("parentEventId");
    console.log(parentEventId);

    const cookies = getCookies();
    const header = { "sessionID": cookies.sessionID };
    const newEvent = {
        name: eventTitle.value,
        memo: memo.value,
        projectId: projectId,
        parentEventId: parentEventId,
        startDateTime: start,
        endDateTime: end,
        timeZone: "Asia/Tokyo"
    }
    axios.post('http://localhost:8080/api/events', newEvent, { headers: header, withCredentials: true })

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
</script>

<template>
    <div class="dialog">
        <div>
            <textarea v-model="eventTitle" @input="eventTitle = $event.target.value" placeholder="イベント"
                class="event-input"></textarea>
            <div style="text-align: left;margin-left: 10px;">
                <input v-model="isAllDay" id="all-day" type="checkbox" style="width: 20px;height: 20px;">
                <label for="all-day">終日</label>
            </div>
            <div v-if="isAllDay">
                <input type="date" v-model="startDate">
                <span style="color: white;margin-left: 10px;margin-right: 10px;">~</span>
                <input type="date" v-model="endDate">
            </div>
            <div v-else>
                <input type="datetime-local" v-model="startDatetimeLocal">
                <span style="color: white;margin-left: 10px;margin-right: 10px;">~</span>
                <input type="datetime-local" v-model="endDatetimeLocal">
            </div>
            <div>
                <select v-model="selectedTemplateId">
                    <option v-for="template of memoTemplateStore.template.values()" :value="template.id">{{ template.name }}
                    </option>
                </select>
                <MdEditor v-model="memo" theme="dark" language="en-US" />
            </div>

            <div v-if="parentEventProjectColorRef">
                <span v-bind:style="{ color: parentEventProjectColorRef }">●</span>
                <span>{{ parentEventProjectNameRef }}</span>
            </div>
            <div v-if="!parentEventProjectNameRef">
                <span v-bind:style="{ color: selectedProjectColor }">●</span>
                <select v-model="selectedProject">
                    <option v-for=" project of projectList" :value="project" style="color: black;">
                        {{ project.name }}
                    </option>
                </select>
            </div>

        </div>
        <div>
            <button @click="addEvent" style="margin-right: 10px;margin-bottom: 10px;">
                追加
            </button>
            <button @click="cancel" style="margin-left: 10px;margin-bottom: 10px;">
                キャンセル
            </button>
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

.event-input {
    height: 50px;
}

.memo-input {
    height: 80px;
}

input {
    background-color: #202124;
    color: white;
}

input[type="date"] {
    position: relative;
}

input[type=date]::-webkit-calendar-picker-indicator {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
}

input[type="datetime-local"] {
    position: relative;
}

input[type=datetime-local]::-webkit-calendar-picker-indicator {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
}

textarea:focus-within {
    border: 1px solid #4285f4;
    outline: none;
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
</style>
<style>
.cm-line {
    text-align: left;
}

.md-editor-preview {
    text-align: left;
}
</style>