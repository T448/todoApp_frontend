<script setup lang="ts">
import StretchableSidebar from './StretchableSidebar.vue'
import SidebarBorder from './SidebarBorder.vue'
import { useRouter } from 'vue-router';
import { ref, onMounted, computed, onBeforeUnmount } from 'vue';
import axios from 'axios';
import { useStoreCounter } from '../stores/counter';

const router = useRouter()

// store
const counter = useStoreCounter();

// 可変サイドバー
const TOGGLE_BTN_WIDTH = 35
const DEFAULT_SIDEBAR_WIDTH = 0.2

const stretchableSidebarStyle = ref({ width: DEFAULT_SIDEBAR_WIDTH });
const pageRect = ref({ width: 0, height: 0 });
const toggleBtnStyle = ref({ width: 0 });

onMounted(() => { setScreenData() });
onMounted(() => { addResizeEvent() });
const setScreenData = () => {
    setPageRect();
    setToggleBtnStyle();
}
const setPageRect = () => {
    const { width, height } = document.getElementById('page')!.getBoundingClientRect();
    pageRect.value.width = width;
    pageRect.value.height = height;
}
const setToggleBtnStyle = () => {
    // 35px(ボタンの横幅)が親要素の横幅に対してどれぐらいの割合かを保存する。
    toggleBtnStyle.value.width = TOGGLE_BTN_WIDTH / pageRect.value.width;
}
const startStretch = () => {
    // 画面上でポインターを動かす度に、handleMoveが呼ばれるようにする。
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', finishStretch);
}
const finishStretch = () => {
    window.removeEventListener('mousemove', handleMove);
    window.removeEventListener('mouseup', finishStretch);
}
const handleMove = (event: MouseEvent) => {
    const { pageX } = event
    const sidebarWidth = pageX / pageRect.value.width; // サイドバーの親要素に対する横幅の割合 = 画面最左からポインターまでの距離 / 親要素の横幅
    if (sidebarWidth >= sidebarMinSize.value) {
        stretchableSidebarStyle.value.width = sidebarWidth;
    } else {
        stretchableSidebarStyle.value.width = sidebarMinSize.value;
        finishStretch();
    }
}
const addResizeEvent = () => {
    window.addEventListener('resize', setScreenData)
}
const removeResizeEvent = () => {
    window.removeEventListener('resize', setScreenData)
}
const toggleSidebar = () => {
    if (stretchableSidebarStyle.value.width === sidebarMinSize.value) {
        stretchableSidebarStyle.value.width = DEFAULT_SIDEBAR_WIDTH;
    } else {
        stretchableSidebarStyle.value.width = sidebarMinSize.value;
    }
}

onBeforeUnmount(() => { removeResizeEvent() });
const stretchableSidebarComputedStyle = computed(() => { return { width: `${stretchableSidebarStyle.value.width * 100}%` } });
const isSidebarOpened = computed(() => { return stretchableSidebarStyle.value.width > sidebarMinSize.value });
const sidebarMinSize = computed(() => { return toggleBtnStyle.value.width / 2 * 0 });

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
    axios
        .post('http://localhost:8080/api/hoge', {}, { withCredentials: true })
        .catch(error => {
            console.log(error.response.status);
            router.push('/app');
        });;
}
</script>

<template>
    <table style="table-layout: fixed;border-collapse:collapse;	width:100%;height: 100vh;padding: 0px;">
        <tr>
            <td id="sideBar">
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
            </td>
            <td style="padding: 0%;">
                <div id="page" style="background-color: #1e1e1e;">
                    <StretchableSidebar :isSidebarOpened="isSidebarOpened" :style="stretchableSidebarComputedStyle"
                        v-slot:projectList>
                        <ul style="color: white;">
                            <li>
                                ここに
                            </li>
                            <li>
                                プロジェクトの一覧を
                            </li>
                            <li>
                                表示します
                            </li>
                            <li>
                                piniaのカウンタ : {{ counter.count }}
                            </li>
                        </ul>
                    </StretchableSidebar>
                    <SidebarBorder :isSidebarOpened="isSidebarOpened" @mousedown.native="startStretch"
                        @toggle-sidebar="toggleSidebar" />
                    <slot name="contents"></slot>
                </div>
            </td>
        </tr>
    </table>
</template>
    
<style scoped>
#page {
    display: flex;
    margin: 0%;
}

#sideBar {
    width: 50px;
    background-color: #050505;
}

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