<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
    date: Number,
    tasks: Array<string>,
})

const date = ref(props.date);
const tasks = ref(props.tasks);

// date.value = new Date();
tasks.value = ['hoge', 'fuga'];
</script>

<template>
    <div class="one-day">
        <div class="date">
            {{ date }}
        </div>
        <div v-for="(task, index) of tasks" class="task">
            <input type="checkbox">
            <label>{{ task }}</label>
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