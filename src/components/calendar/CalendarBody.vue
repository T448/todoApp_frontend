<script setup lang="ts">
import OneDay from './OneDay.vue';
import AddEventDialog from '../AddEventDialog.vue';
import { ref } from 'vue';

const isShowDialog = ref(false);

const showAddEventDialog = () => {
    isShowDialog.value = true;
};
const closeAddEventDialog = () => {
    isShowDialog.value = false;
}
const stopEvent = () => {
    event?.stopPropagation();
}
</script>

<template>
    <div>
        <img src="../../assets/icons8-back-30.png" class="month-button">
        <span style="color:white;font-size:28px">2023年9月</span>
        <img src="../../assets/icons8-forward-30.png" class="month-button">
        <button @click="showAddEventDialog">+</button>
    </div>
    <table class="calendarTable">
        <thead style="color:white">
            <th>Sun</th>
            <th>Mon</th>
            <th>Tue</th>
            <th>Wed</th>
            <th>Thu</th>
            <th>Fri</th>
            <th>Sat</th>
        </thead>
        <tbody>
            <tr v-for="week of 5">
                <td v-for="day of 7">
                    <OneDay :date="Number(String(week) + String(day))" @show-add-event-dialog="showAddEventDialog" />
                </td>
            </tr>
        </tbody>
    </table>
    <div v-if="isShowDialog" @click.stop="closeAddEventDialog" id="overlay">
        <div id="content" @click="stopEvent">
            <AddEventDialog @close-dialog="closeAddEventDialog" />
        </div>
    </div>
</template>

<style scoped>
/* 縦100%はギリギリすぎたので少し減らした */
.calendarTable {
    width: 100%;
    height: 95%;
    border-spacing: 0;
    margin-bottom: 10px;
}

.month-button {
    opacity: 0.5;
    filter: invert(100%);
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.month-button:hover {
    opacity: 1;
}

#overlay {
    /*　要素を重ねた時の順番　*/
    z-index: 1;

    /*　画面全体を覆う設定　*/
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);

    /*　画面の中央に要素を表示させる設定　*/
    display: flex;
    align-items: center;
    justify-content: center;

}

#content {
    z-index: 2;
    max-width: 50%;
    max-height: 50%;
    background: #fff;
}
</style>