<script setup lang="ts">
import { ref } from 'vue';
import { event, defaultEvent0 } from '../../type/event';
import { dateTimeConverter } from '../../modules/dateTimeConverter';
import ChildEventListItem from './ChildEventListItem.vue';

interface Props {
    event: event;
}

const props = withDefaults(defineProps<Props>(), { event: () => defaultEvent0 });

const emits = defineEmits<{
    (e: 'showAddEventDialog'): void,
    (e: 'closeDialog'): void
}>();
const close = () => {
    emits('closeDialog');
}
const event = ref(props.event);
const eventTitle = ref(props.event.title);
const memo = ref(props.event.memo);
const start = ref(props.event.startDate);
const end = ref(props.event.endDate);
const childEvents = ref(props.event.children);
</script>


<template>
    <div class="dialog">
        <div>
            <div class="text">{{ eventTitle }}</div>
            <div class="text">{{ dateTimeConverter(start) }}</div>
            <div class="text">{{ dateTimeConverter(end) }}</div>
            <div class="text">{{ memo }}</div>
        </div>
        <div>
            <!-- TODO : クリックで子タスクの詳細に飛べるようにする -->
            <!-- TODO : 子タスクの一覧を出すトグルボタンをつける -->
            <div v-if="childEvents" class="text">子タスク</div>
            <div v-for="childEvent of childEvents">
                <ChildEventListItem :event="childEvent" :indent-count="1" />
            </div>
        </div>
        <div>
            <button @click="emits('showAddEventDialog')">子タスクを追加</button>
            <button @click="close">閉じる</button>
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
</style>