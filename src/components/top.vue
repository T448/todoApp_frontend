<script setup lang="ts">
import type { CallbackTypes } from "vue3-google-login";
import { decodeCredential } from "vue3-google-login";
import { useRouter } from 'vue-router';
import axios from "axios";

const router = useRouter()

const callback: CallbackTypes.CredentialCallback = (response) => {
    // This callback will be triggered when the user selects or login to
    // his Google account from the popup
    console.log("Credential JWT string", response);
    console.log("Credential JWT string", response.credential);
    console.log(decodeCredential(response.credential));

    const res: any = decodeCredential(response.credential);
    axios
        .post("http://localhost:8080/api/login", { email: res.email, name: res.name }, { withCredentials: true })
        .then(res => {
            if (res.data.sessionID) {
                $cookies.set("sessionID", res.data.sessionID)
                router.push({ name: 'main' });
            } else {
                alert("不正なログイン1");
            }
        })
        .catch(() => { alert('不正なログイン2') });;
};
</script>

<template>
    <header id="beforeLoginHeader">
        <h1 style="color: white;padding: 0px;margin: 0px;box-shadow: 5px;">
            todoApp
        </h1>
        <GoogleLogin :callback="callback" prompt auto-login />
    </header>
    <div id="beforeLogin">

    </div>
</template>

<style scoped>
#beforeLoginHeader {
    background-color: #191919;
    position: fixed;
    width: 100%;
    display: flex;
    justify-content: space-between;
    /* display: flex;
    height: 60px;
    left: 0;
    top: 0;
    margin: 0;
    */
    z-index: 1001;
    box-shadow: 0 2px 3px rgba(255, 255, 255, 0.25);
    /*これを付け足し*/
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