<script setup lang="ts">
import { Ref, computed, ref } from 'vue';
import { useProjectStore } from '../../stores/projectStore';

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

const props = defineProps<{
    parentEventProjectName?: String,
    parentEventProjectColor?: String
}>();

const emits = defineEmits<{
    (e: 'closeDialog'): void
}>();
const cancel = () => {
    emits('closeDialog');
}
const eventTitle: Ref<string | number | string[] | undefined> = ref();
const memo: Ref<string | number | string[] | undefined> = ref();
const isAllDay = ref(false);
const startDate: Ref<Date | undefined> = ref();
const startDatetimeLocal: Ref<Date | undefined> = ref();
const endDate: Ref<Date | undefined> = ref();
const endDatetimeLocal: Ref<Date | undefined> = ref();


const parentEventProjectNameRef = ref(props.parentEventProjectName);
const parentEventProjectColorRef: Ref<String | undefined> = ref(props.parentEventProjectColor);

const selectedProject: Ref<project | undefined> = ref(projectList.value.at(0));
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
}
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
            <span style="color: white;">{{ eventTitle }}</span>
            <textarea v-model="memo" @input="memo = $event.target.value" placeholder="メモ" class="memo-input"></textarea>
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
    width: 400px;
    height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
</style>