import axios from 'axios';
import { defineStore } from 'pinia';
import { getCookies } from 'typescript-cookie';

export const useEventStore = defineStore('events', {
    state: () => ({
        email: '',
        events: []
    }),
    actions: {
        async fetch(
            all: boolean
        ) {
            const cookies = getCookies();
            const header = { "sessionID": cookies.sessionID };
            const res = await axios
                .get(`http://localhost:8080/api/events?all=${all}`, { headers: header, withCredentials: true });
            this.events = res.data;
        }
    }
})