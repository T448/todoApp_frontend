import { createRouter, createWebHistory } from 'vue-router';
import BeforeLogin from './components/BeforeLogin.vue';
import axios from 'axios';
import AfterLogin from './components/AfterLogin.vue';

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
    if ((from.name == "beforeLogin" && to.name == "main") || to.name == "beforeLogin") {
        // login時にセッションを発行するのでそのまま通す。
        next();
    } else if (to.matched.length == 0) {
        // 行先が定義されていなければmainに戻す
        router.push({ name: "main" });
    }
    else {
        console.log('>> check session');
        axios
            .post("http://localhost:8080/api/hoge", {}, { withCredentials: true })
            .then(res => {
                if (res.status !== 200) {
                    next({ name: "beforeLogin" });
                } else {
                    console.log('<< check session');
                    next();
                }
            }).catch(error => {
                console.log(error.response.status);
                next({ name: "beforeLogin" });
            });

    }
})

export default router;
