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
                    <StretchableSidebar :isSidebarOpened="isSidebarOpened" :style="stretchableSidebarComputedStyle" />
                    <SidebarBorder :isSidebarOpened="isSidebarOpened" @mousedown.native="startStretch"
                        @toggle-sidebar="toggleSidebar" />
                </div>
            </td>
        </tr>
    </table>
</template>
  
<script  lang="ts">
import StretchableSidebar from './StretchableSidebar.vue'
import SidebarBorder from './SidebarBorder.vue'
import axios from 'axios'
const TOGGLE_BTN_WIDTH = 35
const DEFAULT_SIDEBAR_WIDTH = 0.2

export default {
    name: 'page',
    components: {
        StretchableSidebar,
        SidebarBorder
    },
    data() {
        return {
            stretchableSidebarStyle: {
                width: DEFAULT_SIDEBAR_WIDTH // 初期表示時の横幅は親要素の20%
            },
            pageRect: {
                width: 0,
                height: 0
            },
            toggleBtnStyle: {
                width: 0
            }
        }
    },
    computed: {
        stretchableSidebarComputedStyle() {
            return { width: `${this.stretchableSidebarStyle.width * 100}%` }
        },
        isSidebarOpened() {
            return this.stretchableSidebarStyle.width > this.sidebarMinSize
        },
        sidebarMinSize() {
            // トグルボタンの横幅の割合の半分をサイドバーの最小値にする
            return this.toggleBtnStyle.width / 2 * 0
        }
    },
    mounted() {
        this.setScreenData();
        this.addResizeEvent();
    },
    beforeDestroy() {
        this.removeResizeEvent()
    },
    methods: {
        setScreenData() {
            this.setPageRect()
            this.setToggleBtnStyle()
        },
        setPageRect() {
            // サイドバーの親要素の横幅と高さを保存。
            const { width, height } = document.getElementById('page')!.getBoundingClientRect()
            this.pageRect.width = width
            this.pageRect.height = height
        },
        setToggleBtnStyle() {
            // 35px(ボタンの横幅)が親要素の横幅に対してどれぐらいの割合かを保存する。
            this.toggleBtnStyle.width = TOGGLE_BTN_WIDTH / this.pageRect.width
        },
        startStretch() {
            // 画面上でポインターを動かす度に、handleMoveが呼ばれるようにする。
            window.addEventListener('mousemove', this.handleMove)
            window.addEventListener('mouseup', this.finishStretch)
        },
        finishStretch() {
            window.removeEventListener('mousemove', this.handleMove)
            window.removeEventListener('mouseup', this.finishStretch)
        },
        handleMove(event: MouseEvent) {
            const { pageX } = event
            const sidebarWidth = pageX / this.pageRect.width // サイドバーの親要素に対する横幅の割合 = 画面最左からポインターまでの距離 / 親要素の横幅
            if (sidebarWidth >= this.sidebarMinSize) {
                this.stretchableSidebarStyle.width = sidebarWidth
            } else {
                this.stretchableSidebarStyle.width = this.sidebarMinSize
                this.finishStretch()
            }
        },
        addResizeEvent() {
            window.addEventListener('resize', this.setScreenData)
        },
        removeResizeEvent() {
            window.removeEventListener('resize', this.setScreenData)
        },
        toggleSidebar() {
            if (this.stretchableSidebarStyle.width === this.sidebarMinSize) {
                this.stretchableSidebarStyle.width = DEFAULT_SIDEBAR_WIDTH
            } else {
                this.stretchableSidebarStyle.width = this.sidebarMinSize
            }
        },
        home() {
            console.log('home');
        },
        openNotification() {
            console.log('open Notification');
        },
        openUser() {
            console.log('open User');
        },
        openSearch() {
            console.log('open Search');
        },
        openSettings() {
            console.log('open Settings');
        },
        logout() {
            console.log('logout');
        },
        test() {
            console.log("test");
            axios
                .post('http://localhost:8080/api/hoge', {}, { withCredentials: true })
                .catch(error => {
                    console.log(error.response.status);
                    this.$router.push('/app');
                });;
        }
    }
}
</script>
  
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