<script setup lang="ts">
import { computed, ref } from 'vue';
import { useProjectStore } from '../stores/projectStore';
import AddProjectDialog from './project/AddProjectDialog.vue';

const projectStore = useProjectStore();
projectStore.fetch();
const projectList = computed(() => {
    const projectListInStore = Array.from(projectStore.projects.values());
    return projectListInStore;
})

const showProjectDetailDialog = () => {
    alert('project詳細ダイアログ作成予定');
}

const showAddProjectDialogRef = ref(false);
const showAddProjectDialog = () => {
    showAddProjectDialogRef.value = true;
}
const closeAddProjectDialog = () => {
    showAddProjectDialogRef.value = false;
}
const stopEvent = () => {
    event?.stopPropagation();
}
document.addEventListener('keydown', e => {
    if (e.key === "Escape") {
        closeAddProjectDialog();
    }
})
</script>

<template>
    <table>
        <tr v-for="projectItem of projectList">
            <td class="project-item" @click="showProjectDetailDialog">
                <span v-bind:style="{ color: projectItem.color }">●</span>
                <span>{{ projectItem.name }}</span>

            </td>
        </tr>
        <tr>
            <td class="project-item" style="text-align: center;" @click="showAddProjectDialog">
                +
            </td>
        </tr>
    </table>
    <div v-if="showAddProjectDialogRef" @click.stop="closeAddProjectDialog" class="overlay">
        <div class="content" @click="stopEvent">
            <AddProjectDialog @close-dialog="closeAddProjectDialog" />
        </div>

    </div>
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

.overlay {
    /*　画面全体を覆う設定　*/
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);

    /*　画面の中央に要素を表示させる設定　*/
    display: flex;
    align-items: center;
    justify-content: center;

}

.content {
    max-width: 50%;
    max-height: 50%;
    background: #fff;
}
</style>