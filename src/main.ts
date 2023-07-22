import { createApp } from "vue"
import router from './router';
import App from "./App.vue";
import Vue3GoogleLogin from 'vue3-google-login';
import VueCookies from 'vue-cookies'
import { createPinia } from 'pinia';
import { createPersistedState } from "pinia-plugin-persistedstate";

const pinia = createPinia();
pinia.use(createPersistedState());

const app = createApp(App);
app.use(router);
app.use(Vue3GoogleLogin, { clientId: import.meta.env.VITE_CLIENT_ID, autoLogin: true });
app.use(VueCookies, { expires: '1d', path: '/', domain: '', secure: '', sameSite: 'Lax' } as any);
app.use(pinia);
app.mount("#app");
