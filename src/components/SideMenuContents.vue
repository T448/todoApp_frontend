<script setup lang="ts">
import { computed } from 'vue';
import { useProjectStore } from '../stores/projectStore';

const projectStore = useProjectStore();
projectStore.fetch();
const projectList = computed(() => {
    const projectListInStore = Array.from(projectStore.projects.values());
    return projectListInStore;
})

const showProjectDetailDialog = () => {
    alert('project詳細ダイアログ作成予定');
}
const shoeAddProjectDialog = () => {
    alert('project追加ダイアログ作成予定');
}
</script>

<template>
    <table>
        <tr v-for="projectItem of projectList">
            <td class="project-item" @click="showProjectDetailDialog">
                {{ projectItem.name }}
            </td>
        </tr>
        <tr>
            <td class="project-item" style="text-align: center;" @click="shoeAddProjectDialog">
                +
            </td>
        </tr>
    </table>
</template>

<style scoped>
table {
    color: white;
    width: 100%
}

tr {
    width: 100%;
}

.project-item {
    padding: 8px;
    width: 100%;
}

.project-item:hover {
    background-color: #3c3c3c;
}
</style>