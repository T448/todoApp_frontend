<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
    date: Number,
    tasks: Array<string>,
})
const emits = defineEmits<{
    (e: 'showAddEventDialog'): void
}>();
const date = ref(props.date);
const tasks = ref(props.tasks);

const showAddButton = ref(false);
const mouseOverAction = () => {
    showAddButton.value = true;
}
const mouseLeaveAction = () => {
    showAddButton.value = false;
}


const onClickAddButton = () => {
    console.log('OneDayのほう');
    emits('showAddEventDialog');
}
// date.value = new Date();
tasks.value = ['hoge', 'fuga'];
</script>

<template>
    <div v-on:mouseover="mouseOverAction" v-on:mouseleave="mouseLeaveAction" class="one-day">
        <div class="date">
            {{ date }}
        </div>
        <div v-for="(task, index) of tasks" class="task">
            <input type="checkbox" :key="index">
            <label>{{ task }}</label>
        </div>
        <div style="text-align: center;">
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
    height: 24px;
}
</style>