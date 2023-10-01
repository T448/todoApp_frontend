<script setup lang="ts">
import { Ref, ref } from 'vue';

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
const projectColorListRef = ref(new Set(["#ff0000", "#00ff00", "#0000ff"]));
const projectColor = ref("#00ff00");
const isChildEvent = ref(true);

const addEvent = () => {
    console.log('startDate');
    console.log(startDate.value);
    const selectedColor = <HTMLInputElement>document.getElementById("projectColor");
    projectColorListRef.value.add(selectedColor.value);
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
            <input v-if="isChildEvent" id="projectColor" type="color" list="color-picker" :value="projectColor" disabled
                style="opacity: 25%;">
            <input v-if="!isChildEvent" id="projectColor" type="color" list="color-picker" :value="projectColor">
            <datalist v-if="!isChildEvent" id="color-picker">
                <option v-for="color of  projectColorListRef" :value=color></option>
            </datalist>
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