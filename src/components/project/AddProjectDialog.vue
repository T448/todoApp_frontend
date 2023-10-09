<script setup lang="ts">
import { ref } from 'vue';
import { getCookies } from 'typescript-cookie';
import axios from 'axios';

const emits = defineEmits<{
    (e: 'closeDialog'): void
}>();
const cancel = () => {
    emits('closeDialog');
}

const projectColorListRef = ref(new Set(["#ff0000", "#00ff00", "#0000ff"]));
const projectColor = ref("#00ff00");
const projectTitle: Ref<string | number | string[] | undefined> = ref();
const memo: Ref<string | number | string[] | undefined> = ref();

type projectRequest = {
    name: string,
    color: string,
    memo: string
}

const addNewProject = () => {
    const selectedColor = <HTMLInputElement>document.getElementById("projectColor");
    projectColorListRef.value.add(selectedColor.value);

    const cookies = getCookies();
    const header = { "sessionID": cookies.sessionID };
    const newProject: projectRequest = {
        name: projectTitle.value,
        color: selectedColor.value,
        memo: memo.value
    }
    if (projectTitle.value !== undefined && projectTitle.value !== null && projectTitle.value !== "") {
        axios.post("http://localhost:8080/api/project", newProject, { headers: header, withCredentials: true })
            .then((res) => {
                console.log("add new project");
                console.log(res);
            })
        emits('closeDialog');
    } else {
        alert('プロジェクト名を入力してください。')
    }
}
</script>

<template>
    <div class="dialog">
        <div>
            <h4>新規プロジェクト作成</h4>
            <textarea v-model="projectTitle" @input="projectTitle = $event.target.value" placeholder="プロジェクト名"
                class="project-input"></textarea>
            <textarea v-model="memo" @input="memo = $event.target.value" placeholder="メモ" class="memo-input"></textarea>
            <input id="projectColor" type="color" list="color-picker" :value="projectColor">
            <datalist id="color-picker">
                <option v-for="color of  projectColorListRef" :value=color></option>
            </datalist>
        </div>
        <div>
            <button @click="addNewProject">追加</button>
            <button @click="cancel">キャンセル</button>
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

.project-input {
    height: 50px;
}

.memo-input {
    height: 80px;
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