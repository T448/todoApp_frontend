<script setup lang="ts">
import OneDay from './OneDay.vue';
import AddEventDialog from './AddEventDialog.vue';
import { computed, ref, Ref } from 'vue';
import { useEventStore } from '../../stores/calendarStore';
import moment from "moment"

const eventStore = useEventStore();
eventStore.fetch(true);

// 日付の配列の作成
type monthAndDay = {
    month: number,
    date: number
}
const jstNow = new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));

const thisYear: Ref<number> = ref(jstNow.getFullYear());
const thisMonth: Ref<number> = ref(jstNow.getMonth() + 1);

const computedDateList = computed(() => {
    const dateList: monthAndDay[] = [];
    const dateListStr: string[] = [];
    const yearMonth = moment([thisYear.value, thisMonth.value - 1]);
    const startDayOfMonth = yearMonth.startOf('month').get('date');
    const endDayOfMonth = yearMonth.endOf('month').get('date');
    const startWeekDayOfMonth = yearMonth.startOf('month').get("weekday");
    const endWeekDayOfMonth = yearMonth.endOf('month').get("weekday");


    for (let d = startDayOfMonth; d <= endDayOfMonth; d++) {
        const m = moment([yearMonth.get('year'), yearMonth.get('month'), d]);
        const dateDict: monthAndDay = {
            month: m.get("month"),
            date: m.get("date")
        }
        dateListStr.push(m.format("yyyy-MM-DD (ddd)"));
        dateList.push(dateDict);
    }
    // 月の始めが日曜日ではないとき、前の月の最後の日曜日までの分を結合する。
    if (startWeekDayOfMonth !== 0) {
        let prevMonth: number;
        let prevYear: number;
        if (thisMonth.value == 1) {
            prevMonth = 12;
            prevYear = thisYear.value - 1;
        } else {
            prevMonth = thisMonth.value - 1;
            prevYear = thisYear.value;
        }
        prevMonth -= 1; // 月は0スタートであるため
        const prevYearMonth = moment([prevYear, prevMonth]);
        const endDayOfPrevMonth = prevYearMonth.endOf('month').get('date');
        for (let d = 0; d < startWeekDayOfMonth; d++) {
            const m = moment([prevYear, prevMonth, endDayOfPrevMonth - d]);
            const dateDict: monthAndDay = {
                month: m.get("month"),
                date: m.get("date")
            }
            dateListStr.unshift(m.format("yyyy-MM-DD (ddd)"));
            dateList.unshift(dateDict);
        }
    }
    // 月の最後が土曜日ではないとき、次の月の最初の土曜日までの分を結合する。
    if (endWeekDayOfMonth !== 6) {
        let nextMonth: number;
        let nextYear: number;
        if (thisMonth.value == 12) {
            nextMonth = 1;
            nextYear = thisMonth.value + 1;
        } else {
            nextMonth = thisMonth.value + 1;
            nextYear = thisYear.value;
        }
        nextMonth -= 1; // 月は0スタートであるため
        for (let d = 1; d < 7 - endWeekDayOfMonth; d++) {
            const m = moment([nextYear, nextMonth, d]);
            const dateDict: monthAndDay = {
                month: m.get("month"),
                date: m.get("date")
            }
            dateListStr.push(m.format("yyyy-MM-DD (ddd)"));
            dateList.push(dateDict);
        }
    }
    return dateList;
})


const goToNextMonth = () => {
    if (thisMonth.value == 12) {
        thisMonth.value = 1;
        thisYear.value += 1;
    } else {
        thisMonth.value += 1;
    }
}
const goToPreviousMonth = () => {
    if (thisMonth.value == 1) {
        thisMonth.value = 12;
        thisYear.value -= 1;
    } else {
        thisMonth.value -= 1;
    }
}

const maxWeeks = computed(() => (computedDateList.value.length / 7));
const thisMonthStr = computed(() => {
    if (thisMonth.value > 0 || thisMonth.value < 10) {
        return '   ' + thisMonth.value.toString();
    } else {
        return thisMonth.value.toString();
    }
})



const showAddEventDialogRef = ref(false);

const showAddEventDialog = () => {
    showAddEventDialogRef.value = true;
};
const closeAddEventDialog = () => {
    showAddEventDialogRef.value = false;
}
const stopEvent = () => {
    event?.stopPropagation();
}
</script>

<template>
    <div style="display: flex;justify-content: space-between;">
        <div>
            <img src="../../assets/icons8-back-30.png" class="month-button" @click="goToPreviousMonth">
            <img src="../../assets/icons8-forward-30.png" class="month-button" @click="goToNextMonth">
            <span style="color:white;font-size:28px">{{ thisYear }}年{{ thisMonthStr }}月</span>
        </div>
        <div>
            <img src="../../assets/icons8-add-50.png" class="month-button" @click="showAddEventDialog">
        </div>
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
            <tr v-for="week of maxWeeks">
                <td v-for="day of 7">
                    <OneDay :date="computedDateList[7 * (week - 1) + day - 1].date"
                        @show-add-event-dialog="showAddEventDialog" />
                </td>
            </tr>
        </tbody>
    </table>
    <div v-if="showAddEventDialogRef" @click.stop="closeAddEventDialog" class="overlay overlay-add-event">
        <div class="content content-add-event" @click="stopEvent">
            <AddEventDialog @close-dialog="closeAddEventDialog" :is-child-event="false" />
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

.overlay {
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

.content {
    max-width: 50%;
    max-height: 50%;
    background: #fff;
}

.overlay-add-event {
    z-index: 3
}

.content-add-event {
    z-index: 4;
}
</style>