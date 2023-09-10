<script setup lang="ts">
import OneDay from './OneDay.vue';
</script>

<template>
    <div>
        <img src="../../assets/icons8-back-30.png" class="month-button">
        <span style="color:white;font-size:28px">9月</span>
        <img src="../../assets/icons8-forward-30.png" class="month-button">
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
                    <OneDay :date="day" />
                </td>
            </tr>
        </tbody>
    </table>
</template>

<style scoped>
/* 縦100%はギリギリすぎたので少し減らした */
.calendarTable {
    width: 100%;
    height: 95%;
    border-spacing: 0;
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
</style>