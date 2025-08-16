<template>
    <div class="artist-avatar" style="display: flex; flex-direction: column; align-items: center;">
        <v-avatar size="100">
            <img :src="avatarUrl" alt="Avatar del artista" />
        </v-avatar>
        <div class="artist-name" style="margin-top: 8px; font-weight: bold;">
            {{ name }}
        </div>
        <div class="artist-followers" style="font-size: 12px; color: #888;">
            {{ followers }} seguidores
        </div>
    </div>
</template>

<script>
export default {
    name: "ArtistAvatar",
    props: {
        name: {
            type: String,
            required: true
        },
        avatarUrl: {
            type: String,
            required: true
        },
        followers: {
            type: Number,
            required: true
        }
    }
}
</script>

<style scoped>
/* Puedes agregar estilos personalizados aquí si lo necesitas */
</style>