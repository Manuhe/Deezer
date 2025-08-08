<template>
    <v-card class="d-flex align-center pa-2" height="100%" flat>
        <v-sheet width="30px" height="30px">
            <v-img :src="image" class="rounded" cover></v-img>
        </v-sheet>
        <div class="ml-4 f-flex justify-start align-start">
            <div class="text-subtitle-1 font-weight-bold">{{ title }}</div>
            <div class="text-caption text-grey">{{ artist }}</div>
        </div>
    </v-card>
</template>

<script setup>
defineProps({
    image: { type: String, required: true },
    title: { type: String, required: true },
    artist: { type: String, required: true }
});
</script>

<style scoped>
.v-card {
    width: 100%;
    max-width: 400px;
    min-width: 200px;
}
</style>