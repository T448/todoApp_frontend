<template>
    <aside id="strechable-sidebar">
        <div :style="sidebarContentComputedStyle">
            <div style="margin-top: 55px;">
                <slot name="projectList">
                    <ul style="color: #ffffff;">
                        <li>あああああ</li>
                        <li>いいいいい</li>
                        <li>ううううう</li>
                    </ul>
                </slot>
            </div>
        </div>
    </aside>
</template>
<script lang="ts">
export default {
    name: 'stretchable-sidebar',
    props: {
        isSidebarOpened: {
            type: Boolean,
            required: true
        }
    },
    computed: {
        sidebarContentComputedStyle() {
            if (this.isSidebarClosed) {
                return { transform: `translateX(-${window.innerWidth}px)` }
            } else {
                return {}
            }
        },
        isSidebarClosed() {
            return !this.isSidebarOpened
        }
    }
}
</script>
<style scoped>
#strechable-sidebar {
    background-color: #191919;
    height: 100vh;
    max-width: 30%;
    overflow: hidden;
    user-select: none;
}
</style>
  