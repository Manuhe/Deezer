<template>
    <v-layout class="main-layout" full-height>
        <!-- Drawer estilo Deezer: solo iconos -->
        <v-navigation-drawer expand-on-hover permanent rail color="#33303c">
            <div class="d-flex justify-center align-center my-4">
                <v-img max-width="100" max-height="100" contain
                    src="https://images.seeklogo.com/logo-png/50/2/deezer-logo-png_seeklogo-507119.png"></v-img>
            </div>

            <v-divider></v-divider>

            <v-list density="compact" nav>
                <v-list-item :prepend-icon="item.icon" :title="item.title" value="myfiles"
                    v-for="(item, index) in navItems" :key="index"></v-list-item>

            </v-list>
        </v-navigation-drawer>

        <!-- App Bar -->
        <v-app-bar app color="#211b27" height="100">
            <template v-slot:prepend>
                <v-sheet width="300" class="my-4 ml-3" color="transparent">
                    <v-text-field height="80" variant="outlined" class="my-3" placeholder="Artistas, tracks, podcast..."
                        prepend-inner-icon="mdi-magnify" single-line hide-details style="max-width: 300px;
               " dense :style="{
                'background-color': '#424242',
                color: 'white'
            }"></v-text-field>
                </v-sheet>
            </template>
            <v-spacer />

            <template v-slot:append>

                <v-btn icon="mdi-account-circle">
                    <v-icon icon="mdi-account-circle"></v-icon>
                </v-btn>
            </template>
        </v-app-bar>

        <!-- Content -->
        <v-main class="bg-grey-darken-3 text-white">
            <v-sheet color="#211b25" height="100vh" class="pa-4">

                <router-view />
            </v-sheet>
        </v-main>
        <v-footer app color="#33303c" height="auto" class="d-flex align-center justify-center" absolute>
            <PlayerMini />
        </v-footer>
    </v-layout>
</template>

<script setup>
import { ref } from 'vue'
import PlayerMini from '@/components/musicPlayer/playerMini.vue'


const drawer = ref(true)

const navItems = [
    { title: 'Inicio', icon: 'mdi-home', to: '/' },
    { title: 'Buscar', icon: 'mdi-magnify', to: '/search' },
    { title: 'Tu Biblioteca', icon: 'mdi-library-music', to: '/library' },
]
</script>

<style scoped>
.main-layout {
    height: 100vh;
}

.deezer-drawer {
    padding-top: 8px;
    border-right: 1px solid #222;
}

.deezer-nav-item {
    min-height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>