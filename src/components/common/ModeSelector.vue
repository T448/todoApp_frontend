<script setup lang="ts">
const select = (e: Event) => {
    const event = e.target as unknown as HTMLSelectElement;
    const target = event.value;
    console.log('display mode : ', target);
}
</script>

<template>
    <div>
        <select name="modeSelector" class="mode-selector" @change="select">
            <option value="Calendar">Calendar</option>
            <option value="ListView">List</option>
            <option value="TimelineView">Timeline</option>
            <option value="GanttChart">GanttChart</option>
        </select>
    </div>
</template>
<style scoped>
.mode-selector {
    color: white;
    background-color: #191919;
    height: 50px;
    width: 250px;
    font-size: 24px;
}
</style>