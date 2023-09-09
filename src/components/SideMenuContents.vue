<script setup lang="ts">

</script>

<template>
    <table>
        <tr v-for="n of 5">
            <td class="project-item">
                hoge+{{ n }}
            </td>
        </tr>
    </table>
</template>

<style scoped>
table {
    color: white;
    width: 100%
}

tr {
    width: 100%;
}

.project-item {
    padding: 8px;
    width: 100%;
}

.project-item:hover {
    background-color: #3c3c3c;
}
</style>