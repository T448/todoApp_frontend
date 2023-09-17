<script setup lang="ts">
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useStoreCounter } from '../stores/counter';
import { getCookies } from 'typescript-cookie';

// store
const counter = useStoreCounter();

const router = useRouter()

// sidebarのボタン用
const home = () => {
    console.log('home');
}
const openNotification = () => {
    console.log('open Notification');
}
const openUser = () => {
    console.log('open User');
}
const openSearch = () => {
    console.log('open Search');
}
const openSettings = () => {
    console.log('open Settings');
}
const logout = () => {
    console.log('logout');
}
const test = () => {
    console.log("test");
    counter.increment();
    const cookies = getCookies();
    const header = { "sessionID": cookies.sessionID };
    axios
        .post('http://localhost:8080/api/hoge', {}, { headers: header, withCredentials: true })
        .then(res => {
            console.log(res);
        })
        .catch(error => {
            console.log(error.response);
            if (error.response.status == 401) {
                alert('セッションが無効です');
            }
            router.push('/app');
        });;
}
</script>

<template>
    <li>
        <div>
            <img src="../assets/icons8-home-50.png" class='sideButton' @click="home" />
            <img src="../assets/icons8-notification-50.png" class='sideButton' @click="openNotification" />
            <img src="../assets/icons8-male-user-50.png" class='sideButton' @click="openUser" />
            <img src="../assets/icons8-search-50.png" class='sideButton' @click="openSearch" />
            <button @click="test">テスト用</button>
        </div>
        <div>
            <img src="../assets/icons8-settings-50.png" class='sideButton' @click="openSettings" />
            <img src="../assets/icons8-logout-50.png" class='sideButton' @click="logout" />
        </div>
    </li>
</template>

<style scoped>
li {
    height: 100%;
    box-sizing: border-box;
    padding-top: 55px;
    padding-bottom: 5px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    display: -webkit-flex;
    -webkit-flex-direction: column;
    -webkit-justify-content: space-between;
}

.sideButton {
    opacity: 0.5;
    filter: invert(100%);
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.sideButton:hover {
    opacity: 1;
}
</style>