import { defineStore } from 'pinia';

export const useStoreCounter = defineStore('counter', {
    state: () => ({
        count: 1,
    }),
    actions: {
        increment() {
            this.count++;
        }
    },
    persist: true // trueにすることでリロードしても値が初期化されず維持される。
});