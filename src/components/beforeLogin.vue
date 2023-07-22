<script setup lang="ts">
import { inject } from "vue";
import type { CallbackTypes } from "vue3-google-login";
import { decodeCredential } from "vue3-google-login";
import { useRouter } from 'vue-router';
import { VueCookies } from "vue-cookies";
import axios from "axios";

const router = useRouter()
const $cookies = inject<VueCookies>('$cookies');

const callback: CallbackTypes.CredentialCallback = (response) => {
    const res: any = decodeCredential(response.credential);
    axios
        .post("http://localhost:8080/api/login", { email: res.email, name: res.name }, { withCredentials: true })
        .then(res => {
            if (res.data.sessionID) {
                $cookies?.set("sessionID", res.data.sessionID)
                console.log("login");
                router.push({ name: 'main' });
            } else {
                alert("不正なログイン1");
            }
        })
        .catch(() => { alert('不正なログイン2') });;
};
</script>

<template>
    <div id="beforeLoginHeader">
        <h1 style="color: white;padding: 0px;margin: 0px;box-shadow: 5px;">
            todoApp
        </h1>
        <GoogleLogin :callback="callback" prompt auto-login />
    </div>
    <div id="beforeLogin" style="vertical-align: center;">
        <img src="/src/assets/undraw_world_re_768g.svg"
            style="max-height:500px;margin-top: 60px;background-color: #191919;">
    </div>
</template>

<style scoped>
#beforeLoginHeader {
    background-color: #191919;
    position: fixed;
    width: 100%;
    display: flex;
    justify-content: space-between;
    height: 50px;
    /* display: flex;
    left: 0;
    top: 0;
    margin: 0;
    */
    z-index: 1001;
    box-shadow: 0 2px 3px rgba(255, 255, 255, 0.25);
}

#beforeLogin {
    background-color: #191919;
    width: 100%;
    height: 100vh;
    text-align: center;
}
</style>

<style>
body {
    margin: 0%;
}
</style>