import axios from "axios";
import { getCookies } from "typescript-cookie";


export type updateEventRequest = {
    eventId: String,
    name: String,
    memo: String,
    projectId: String,
    startDate: String,
    endDate: String,
    startDateTime: String,
    endDateTime: String,
    timeZone: String
}

export const updateEvent = (request: updateEventRequest) => {
    const cookies = getCookies();
    const header = { "sessionID": cookies.sessionID };

    axios
        .put('http://localhost:8080/api/events', request, { headers: header, withCredentials: true })
        .then((res) => { console.log(res) })
        .catch((error) => { alert(error) });
}

export const deleteEvents = (projectId: string, eventIdList: string[]) => {
    const cookies = getCookies();
    const header = { "sessionID": cookies.sessionID };
    const request = {
        projectId: projectId,
        eventIdList: eventIdList
    }
    axios
        .delete('http://localhost:8080/api/events', { headers: header, withCredentials: true, data: request })
        .then((res) => { console.log(res) })
        .catch((error) => { alert(error) });
}