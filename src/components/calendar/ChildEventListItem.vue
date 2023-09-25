<script setup lang="ts">
import { ref, computed } from 'vue';
import { event } from '../../type/event';


interface Props {
    event: event,
    indentCount: number
}

const props = defineProps<Props>();
const event = ref(props.event);
const openChildEventsListRef = ref(false);
const childEventsListSwitch = () => {
    openChildEventsListRef.value = !openChildEventsListRef.value;
}

const listItemStyle = computed(() => {
    return { '--indent-count': props.indentCount }
})

</script>
<template>
    <span v-if="event.children !== undefined && event.children.length > 0">
        <button v-if="!openChildEventsListRef" @click="childEventsListSwitch">></button>
        <button v-else @click="childEventsListSwitch">v</button>
    </span>
    {{ event.title }}
    <div v-for="childEvent of event.children">
        <div v-if="openChildEventsListRef" :style="listItemStyle" class="list-item">
            <ChildEventListItem :event="childEvent" :indent-count="indentCount + 1" />
        </div>
    </div>
</template>
<style scoped>
.list-item {
    margin-left: calc(50px * var(--indent-count));
}
</style>