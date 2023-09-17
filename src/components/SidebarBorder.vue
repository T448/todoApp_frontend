<script setup lang="ts">

defineProps({
    isSidebarOpened: {
        type: Boolean,
        required: true
    }
})
const emits = defineEmits(['toggle-sidebar']);

const toggleSidebar = () => {
    emits('toggle-sidebar');
}
</script>

<template>
    <div id="sidebar-border">
        <span id="sidebar-border-btn" @click="toggleSidebar">
            <img src="../assets/icons8-menu-50.png" class="sideButton" />
        </span>
    </div>
</template>

<style scoped>
#sidebar-border {
    width: 3px;
    height: 100vh;
    position: relative;
    background-color: #303030;
}

#sidebar-border:hover {
    background-color: #505050;
    cursor: col-resize;
}

#sidebar-border-btn {
    width: 50px;
    height: 50px;
    /* background-color: #303030; */
    /* border: 1px solid #505050; */
    display: inline-block;
    text-align: center;
    box-shadow: .5px .5px .5px rgba(0, 0, 0, 0.6);
    position: absolute;
    top: 0px;
    left: -50px;
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
  