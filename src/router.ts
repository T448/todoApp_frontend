import { createRouter, createWebHistory } from 'vue-router';
import outerFrame from './components/outerFrame.vue';
import top from './components/top.vue';
import calendarView from './components/calendarView.vue';
import axios from 'axios';

const routes = [
    { path: '/app', name: 'top', component: top },
    { path: '/app/main', name: 'main', component: outerFrame },
    { path: '/app/calendar', name: 'calendar', component: calendarView },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    if ((from.name == "top" && to.name == "main") || to.name == "top") {
        // login時にセッションを発行するのでそのまま通す。
        next();
    } else if (to.matched.length == 0) {
        // 行先が定義されていなければmainに戻す
        router.push({ name: "main" });
    }
    else {
        axios
            .post("http://localhost:8080/api/session", {}, { withCredentials: true })
            .then(res => {
                if (res.status !== 200) {
                    next({ name: "top" });
                } else {
                    next();
                }
            }).catch(error => {
                console.log(error.response.status);
                next({ name: "top" });
            });

    }
})

export default router;
