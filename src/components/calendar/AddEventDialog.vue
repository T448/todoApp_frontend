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
    start?: string
}>();

const emits = defineEmits<{
    (e: 'closeDialog'): void
}>();
const cancel = () => {
    emits('closeDialog');
}
const eventTitle: Ref<string | number | string[] | undefined> = ref();
// const memo: Ref<string | number | string[] | undefined> = ref();
const memo = ref('');
const isAllDay = ref(true);
const startDate: Ref<string | undefined> = ref(props.start);
const startDateTime: Ref<string | undefined> = ref(props.start + "T00:00");
const endDate: Ref<string | undefined> = ref();
const endDateTime: Ref<string | undefined> = ref();


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

const addEvent = () => {
    let newEvent = {
        name: eventTitle.value,
        memo: memo.value,
        projectId: "",
        parentEventId: "",
        startDate: "",
        endDate: "",
        startDateTime: "",
        endDateTime: "",
        timeZone: "UTC"
    }

    if (parentEventProjectIdRef.value) {
        console.log("親イベントあり");
        newEvent.projectId = parentEventProjectIdRef.value.toString()
    } else if (selectedProject.value?.id) {
        console.log("親イベントなし");
        newEvent.projectId = selectedProject.value?.id;
    } else {
        alert("イベント追加に失敗");
        return;
    }

    if (isAllDay.value) {
        if (startDate.value !== undefined && endDate.value !== undefined) {
            newEvent.startDate = startDate.value;
            newEvent.endDate = endDate.value;
        }
        else {
            alert('日付を入力してください');
            return;
        }
    } else {
        if (startDateTime.value !== undefined && endDateTime.value !== undefined) {
            newEvent.startDateTime = (new Date(startDateTime.value)).toISOString();
            newEvent.endDateTime = (new Date(endDateTime.value)).toISOString();
        } else {
            alert('日時を入力してください');
            return;
        }
    }

    if (parentEventIdRef.value) {
        newEvent.parentEventId = parentEventIdRef.value.toString();
    }
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz !== null && tz !== undefined) {
        newEvent.timeZone = tz;
    }

    const cookies = getCookies();
    const header = { "sessionID": cookies.sessionID };
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
                <input type="datetime-local" v-model="startDateTime">
                <span style="color: white;margin-left: 10px;margin-right: 10px;">~</span>
                <input type="datetime-local" v-model="endDateTime">
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

.md-editor {
    height: 400px;
}
</style>