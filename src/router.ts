import { createRouter, createWebHistory } from 'vue-router';
import BeforeLogin from './components/BeforeLogin.vue';
import axios from 'axios';
import AfterLogin from './components/AfterLogin.vue';
import { getCookies, setCookie, removeCookie } from 'typescript-cookie';

const routes = [
    { path: '/app', name: 'beforeLogin', component: BeforeLogin },
    { path: '/app/main', name: 'main', component: AfterLogin },
    // { path: '/app/main/:project_id/0', name: 'calendar', component: CalendarView },
    // { path: '/app/main/:project_id/1', name: 'list', component: ListView },
    // { path: '/app/main/:project_id/2', name: 'timeLine', component: TimelineView },
    // { path: '/app/main/:project_id/3', name: 'ganttChart', component: GanttChart },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    console.log("----------beforeEach----------");
    console.log("from");
    console.log(from);
    console.log("to");
    console.log(to);
    if (to.query.code) {
        console.log('auth code');
        console.log(to.query.code);
        const headers = {
            'Content-Type': 'application/json',
            'authorization': to.query.code.toString()
        }
        axios
            .post("http://localhost:8080/api/login", {}, { headers: headers, withCredentials: true })
            .then(res => {
                if (res.status !== 200) {
                    next({ name: "beforeLogin" });
                } else {
                    console.log('<< check session');
                    console.log(res);
                    // alert(res.data.sessionId);
                    setCookie("sessionID", res.data.sessionId);
                    next();
                }
            }).catch(error => {
                console.log(error.response);
                alert('セッションが無効です1' + error + ":" + error.response.data);
                if (error.response.code == 401) {
                    alert('セッションが無効です');
                    removeCookie("sessionID");
                }
                next({ name: "beforeLogin" });
            });
    } else if ((from.name == "beforeLogin" && to.name == "main") || to.name == "beforeLogin") {
        // login時にセッションを発行するのでそのまま通す
        next();
    } else if (to.matched.length == 0) {
        // 行先が定義されていなければmainに戻す
        router.push({ name: "main" });
    }
    else {
        console.log('>> check session');
        const cookies = getCookies();
        if ("sessionID" in cookies) {
            const header = { "sessionID": cookies.sessionID };
            axios
                .post("http://localhost:8080/api/session", {}, { headers: header, withCredentials: true })
                .then(res => {
                    if (res.status !== 200) {
                        next({ name: "beforeLogin" });
                    } else {
                        console.log('<< check session');
                        next();
                    }
                }).catch(error => {
                    if (error.response.code == 401) {
                        console.log(error.response);
                        alert('セッションが無効です');
                    }
                    next({ name: "beforeLogin" });
                });

        } else {
            next({ name: "beforeLogin" });
        }

    }
})

export default router;
