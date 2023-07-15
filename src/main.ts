import { createApp } from "vue"
import router from './router';
import App from "./App.vue";
import Vue3GoogleLogin from 'vue3-google-login';
import VueCookies from 'vue-cookies'

const app = createApp(App);
app.use(router);
app.use(Vue3GoogleLogin, { clientId: import.meta.env.VITE_CLIENT_ID, autoLogin: true });
app.use(VueCookies, { expires: '1d', path: '/', domain: '', secure: '', sameSite: 'Lax' } as any);
app.mount("#app");
