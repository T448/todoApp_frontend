import { defineStore } from "pinia";
import { project } from "../type/project";
import { getCookies } from "typescript-cookie";
import axios from "axios";

export const useProjectStore = defineStore('projects', {
    state: () => ({
        projects: new Map() as Map<String, project>
    }),
    actions: {
        async fetch() {
            const cookies = getCookies();
            const header = { "sessionID": cookies.sessionID };
            const res = await axios
                .get(`http://localhost:8080/api/projects`, { headers: header, withCredentials: true });
            res.data.forEach((item: project) => {
                const createdAt = new Date(item.createdAt);
                const updatedAt = new Date(item.updatedAt);
                createdAt.setHours(createdAt.getHours() - 9);
                updatedAt.setHours(updatedAt.getHours() - 9);
                this.projects.set(item.id, {
                    id: item.id,
                    name: item.name,
                    memo: item.memo,
                    color: item.color,
                    email: item.email,
                    createdAt: createdAt,
                    updatedAt: updatedAt
                } as project);
            })
        },
        clear() {
            this.projects = new Map<String, project>();
        }
    }
})