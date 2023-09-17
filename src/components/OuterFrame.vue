<script setup lang="ts">
import StretchableSidebar from './StretchableSidebar.vue'
import SidebarBorder from './SidebarBorder.vue'
import { ref, onMounted, computed, onBeforeUnmount } from 'vue';
import SidebarButtons from './SidebarButtons.vue';

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


</script>

<template>
    <table style="table-layout: fixed;border-collapse:collapse;	width:100%;height: 100vh;padding: 0px;">
        <tr>
            <td id="sideBar">
                <SidebarButtons />
            </td>
            <td style="padding: 0%;">
                <div id="page" style="background-color: #1e1e1e;">
                    <StretchableSidebar :isSidebarOpened="isSidebarOpened" :style="stretchableSidebarComputedStyle">
                        <template #sideBarContents>
                            <slot name="sideBarContents"></slot>
                        </template>
                    </StretchableSidebar>
                    <SidebarBorder :isSidebarOpened="isSidebarOpened" @mousedown.native="startStretch"
                        @toggle-sidebar="toggleSidebar" />
                    <slot name="mainContents"></slot>
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
</style>