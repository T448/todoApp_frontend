<script setup lang="ts">
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { Ref, ref, watch } from 'vue';
import { useMemoTemplateStore } from '../../stores/memoTemplateStore';
import { memoTemplate } from '../../type/memoTemplate';
import axios from 'axios';
import { getCookies } from "typescript-cookie";

const memoTemplateStore = useMemoTemplateStore();
memoTemplateStore.fetch();

const emits = defineEmits<{
    (e: 'closeDialog'): void
}>();
const cancel = () => {
    emits('closeDialog');
}

const templateName = ref('');
const template = ref('');
const selectedTemplateId: Ref<string | undefined> = ref('');

watch(selectedTemplateId, () => {
    templateName.value = "";
    template.value = "";
    if (selectedTemplateId.value !== undefined && selectedTemplateId.value !== "add") {
        if (memoTemplateStore.template.has(selectedTemplateId.value)) {
            const selectedTemplate = memoTemplateStore.template.get(selectedTemplateId.value);
            if (selectedTemplate !== undefined) {
                templateName.value = selectedTemplate.name;
                template.value = selectedTemplate.template;
            }
        }
    }
});

const confirm = () => {
    if (selectedTemplateId.value !== undefined) {
        const cookies = getCookies();
        const header = { "sessionID": cookies.sessionID };
        const request: memoTemplate = {
            id: selectedTemplateId.value,
            name: templateName.value,
            template: template.value
        }
        if (selectedTemplateId.value == "add") {
            // 新規
            axios.post('http://localhost:8080/api/memo', request, { headers: header, withCredentials: true });
        } else {
            // 更新
            axios.put('http://localhost:8080/api/memo', request, { headers: header, withCredentials: true });
        }
    }
}
</script>

<template>
    <div class="dialog">
        <div>
            <div style="background-color: black;">
                Template Editor
            </div>
            <div>
                <select v-model="selectedTemplateId">
                    <option v-for="template of memoTemplateStore.template.values()" :value="template.id">{{ template.name }}
                    </option>
                    <option value="add">追加</option>
                </select>
                <textarea v-if="selectedTemplateId" v-model="templateName"></textarea>
            </div>
            <div v-if="selectedTemplateId" style="max-height: 400px;overflow-y: auto;">
                <MdEditor v-model="template" theme="dark" language="en-US" />
            </div>
        </div>
        <div>
            <button v-if="selectedTemplateId" @click="confirm">確定</button>
            <button @click="cancel">キャンセル</button>
        </div>
    </div>
</template>
<style scoped>
.dialog {
    text-align: center;
    background-color: #35363a;
    width: 1200px;
    height: 600px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
</style>