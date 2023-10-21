import axios from "axios";
import { getCookies } from "typescript-cookie";


export type updateEventRequest = {
    eventId: String,
    name: String,
    memo: String,
    projectId: String,
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