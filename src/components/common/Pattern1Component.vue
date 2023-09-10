<script setup lang="ts">

</script>

<template>
    <!-- 一番上のdivはsideBarと横並び。その中のdivは縦並びになる。 -->
    <div style="min-width: 70%;">
        <div class="titleBar">
            <slot name="titleBar"></slot>
        </div>
        <div class="pattern1Body">
            <slot name="body"></slot>
        </div>
    </div>
</template>

<style scoped>
.titleBar {
    height: 80px;
    width: 100%;
    margin: 8px;
}

.pattern1Body {
    height: calc(100% - 80px - 16px);
    width: 100%;
    margin: 8px;
}
</style>