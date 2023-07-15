import { createRouter, createWebHistory } from 'vue-router';
import outerFrame from './components/outerFrame.vue';
import top from './components/top.vue';

const routes = [
    { path: '/app/outerFrame', name: 'outerFrame', component: outerFrame, },
    { path: '/app', name: 'top', component: top },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;
