<script setup lang="ts">
import { inject } from "vue";
import { googleAuthCodeLogin } from "vue3-google-login"
import { useRouter } from 'vue-router';
import { VueCookies } from "vue-cookies";
import axios from "axios";

const router = useRouter()
const $cookies = inject<VueCookies>('$cookies');


const login = () => {
    googleAuthCodeLogin()
        .then((response) => {
            axios
                .post('http://localhost:8080/api/login', {},
                    { headers: { "Authorization": response.code, "Content-Type": "application/json" }, withCredentials: true })
                .then((response_from_oauth2) => {
                    if (response_from_oauth2.status == 200) {
                        $cookies?.set("sessionID", response_from_oauth2.data.sessionId)
                        router.push({ name: 'main' });
                    } else {
                        alert("error");
                    }
                })
        })

}
</script>

<template>
    <div id="beforeLoginHeader">
        <h1 style="color: white;padding: 0px;margin: 0px;box-shadow: 5px;">
            todoApp
        </h1>
        <!-- <GoogleLogin :callback="callback" prompt auto-login /> -->
        <button @click="login">Login Using Google</button>
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