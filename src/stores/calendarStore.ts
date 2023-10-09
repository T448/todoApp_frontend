import axios from 'axios';
import { defineStore } from 'pinia';
import { getCookies } from 'typescript-cookie';
import { calendarEventBase } from '../type/event';

export const useEventStore = defineStore('calendarEvents', {
    state: () => ({
        email: '',
        calendarEvents: new Map() as Map<String, calendarEventBase>,
    }),
    actions: {
        async fetch(
            all: boolean
        ) {
            const cookies = getCookies();
            const header = { "sessionID": cookies.sessionID };
            const res = await axios
                .get(`http://localhost:8080/api/events?all=${all}`, { headers: header, withCredentials: true });
            res.data.forEach((item: calendarEventBase) => {
                this.calendarEvents.set(item.id, {
                    id: item.id,
                    email: item.email,
                    title: item.title,
                    shortTitle: item.shortTitle,
                    projectId: item.projectId,
                    projectColor: item.projectColor,
                    parentEventId: item.parentEventId,
                    childEventIdList: item.childEventIdList,
                    memo: item.memo,
                    start: new Date(item.start),
                    end: new Date(item.end),
                    createdAt: new Date(item.createdAt),
                    updatedAt: new Date(item.updatedAt)
                } as calendarEventBase);
            })
        },
        clear() {
            this.calendarEvents = new Map<String, calendarEventBase>();
        }
    },
    getters: {
        getCalendarEvents(): Map<String, calendarEventBase> {
            return this.calendarEvents;
        }
    }
})