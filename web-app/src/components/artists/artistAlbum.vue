<template>
    <v-card class="pa-3 d-flex flex-column align-center" max-width="220" color="transparent" flat
        style=" border-radius: 5px; margin-bottom: 20px;">

        <v-img :src="album.cover" alt="Album Cover" width="200" height="200" class="mb-2"
            style=" border-radius: 10px; object-fit: cover;" cover />
        <v-card-title class="text-center py-1">{{ album.name }}</v-card-title>
        <v-card-subtitle class="text-center text-grey">
            {{ album.tracks }} canciones · {{ album.fans }} fans
        </v-card-subtitle>
    </v-card>
</template>

<script setup>
defineProps({
    album: {
        type: Object,
        required: true,
        // { cover: String, name: String, tracks: Number, fans: Number }
    }
});
</script>