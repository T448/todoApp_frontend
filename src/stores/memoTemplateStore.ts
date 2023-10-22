import { defineStore } from "pinia";
import { memoTemplate } from "../type/memoTemplate";
import { getCookies } from "typescript-cookie";
import axios from "axios";

export const useMemoTemplateStore = defineStore('memoTemplates', {
    state: () => ({
        template: new Map() as Map<String, memoTemplate>,
    }),
    actions: {
        async fetch() {
            console.log("fetch memo template");
            const cookies = getCookies();
            const header = { "sessionID": cookies.sessionID };
            const res = await axios
                .get(`http://localhost:8080/api/memo`, { headers: header, withCredentials: true });
            if (res.data) {
                res.data.forEach((item: memoTemplate) => {
                    this.template.set(item.id, item);
                })
            }
            console.log(this.template)
        },
        clear() {
            this.template = new Map<String, memoTemplate>();
        }
    }
})