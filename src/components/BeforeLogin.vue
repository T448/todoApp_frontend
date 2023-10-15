<script setup lang="ts">
import { useRouter } from 'vue-router';
import { getCookies, removeCookie, getCookie } from 'typescript-cookie';
import axios from 'axios';

const router = useRouter();

const clientId: string = import.meta.env.VITE_CLIENT_ID;
const redirectUri = encodeURI('http://localhost:5173/app');
const scope = encodeURI('email profile openid https://www.googleapis.com/auth/calendar');
const prompt = "select_account";
const loginURL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&access_type=offline&prompt=${prompt}`;
const loginWindowName = "loginWindow";

const login = () => {
    const cookies = getCookies();
    if ("sessionID" in cookies) {
        const header = { "sessionID": cookies.sessionID };
        console.log("login session request");
        axios
            .post("http://localhost:8080/api/session", {}, { headers: header, withCredentials: true })
            .then((res) => {
                console.log("login session");
                console.log(res);
                router.push({ name: 'main' });
            }).catch(error => {
                console.log(error);
                removeCookiePromise("sessionID").then(() => {
                    useGoogleLogin();
                })

            })
    } else {
        useGoogleLogin();
    }
}

const useGoogleLogin = () => {
    const w = window.open(loginURL, loginWindowName);
    let counter = 0;
    const timer = setInterval(() => {
        if (w == null) return;
        const windowKeySet = new Set(Object.keys(w));
        if (windowKeySet.has('name') && w.name == loginWindowName) {
            if (getCookie("sessionID") != undefined || counter == 16) {
                w.close();
                router.push({ name: 'main' });
                clearInterval(timer);
            } else {
                counter++;
            }
        } else if (w.closed) {
            clearInterval(timer);
        } else {
            return;
        }
    }, 1000);
}

const removeCookiePromise = (cookieName: string) => {
    return new Promise((resolve, reject) => {
        try {
            resolve(removeCookie(cookieName));
        } catch (error) {
            reject();
        }

    })
}

</script>

<template>
    <div id="beforeLoginHeader">
        <h1 style="color: white;padding: 0px;margin: 0px;box-shadow: 5px;">
            todoApp
        </h1>
        <a class="google-signin" @click="login"></a>
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

.google-signin {
    background-image: url("/src/assets/google/btn_google_signin_dark_normal_web.png");
    display: inline-block;
    width: 191px;
    height: 46px;
    background-color: transparent;
    background-repeat: no-repeat;
    background-size: 191px 46px;

    &:hover {
        background-image: url("/src/assets/google/btn_google_signin_dark_focus_web.png");
        cursor: pointer;
    }

    &:active {
        background-image: url("/src/assets/google/btn_google_signin_dark_pressed_web.png");
    }
}
</style>