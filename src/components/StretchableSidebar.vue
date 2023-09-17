<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps({
    isSidebarOpened: {
        type: Boolean,
        required: true
    }
})

const isSidebarOpened = ref(props.isSidebarOpened);
const isSidebarClosed = computed(() => {
    return !isSidebarOpened
});
const sidebarContentComputedStyle = computed(() => {
    if (isSidebarClosed.value) {
        return { transform: `translateX(-${window.innerWidth}px)` };
    } else {
        return {};
    }
})
</script>

<template>
    <aside id="strechable-sidebar">
        <div :style="sidebarContentComputedStyle">
            <div style="margin-top: 55px;">
                <slot name="sideBarContents">
                    <ul style="color: #ffffff;">
                        <li>project1</li>
                        <li>project2</li>
                        <li>project3</li>
                    </ul>
                </slot>
            </div>
        </div>
    </aside>
</template>

<style scoped>
#strechable-sidebar {
    background-color: #191919;
    height: 100vh;
    max-width: 30%;
    overflow: hidden;
}
</style>
  
