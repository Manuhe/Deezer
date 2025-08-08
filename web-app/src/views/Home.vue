<template>

    <MainLayout>
        <v-container fluid>



            <v-card color="transparent" class="pa-4" flat>
                <v-card-title class="text-h5 font-weight-bold">
                    Continue streaming
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col v-for="(artist, index) in artists" :key="index">

                            <div class="d-flex flex-wrap">
                                <artist-avatar :name="artist.name" :avatarUrl="artist.image"
                                    :followers="artist.followers"></artist-avatar>
                            </div>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-title class="text-h5 font-weight-bold mt-5">
                    Feels like summer
                    <v-btn variant="plain">
                        view all
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    <v-slide-group v-model="model" class="pa-4" selected-class="bg-success" show-arrows>
                        <v-slide-group-item v-for="(album, index) in albums" :key="index">
                            <div class="mx-3">

                                <artist-album :album="album"></artist-album>
                            </div>
                        </v-slide-group-item>
                    </v-slide-group>

                </v-card-text>

                <v-card-title>
                    Mixes inspired by...
                </v-card-title>
                <v-card-subtitle>
                    Discover new tracks similar to your favourites
                </v-card-subtitle>
                <v-card-text></v-card-text>
                <v-row>
                    <v-col cols=12 md="6" sm="6" lg="6" v-for="(track, index) in tracks" :key="index">
                        <track-vertical :image="track.image" :title="track.title"
                            :artist="track.artist"></track-vertical>
                    </v-col>
                </v-row>
            </v-card>
        </v-container>
    </MainLayout>
</template>

<script setup>
import artistAvatar from '../components/artists/artistAvatar.vue';
const artists = ref([
    {
        "name": "Taylor Swift",
        "followers": 95000000,
        "image": "https://link-to-image/taylor-swift.jpg"
    },
    {
        "name": "Bad Bunny",
        "followers": 80000000,
        "image": "https://link-to-image/bad-bunny.jpg"
    },
    {
        "name": "The Weeknd",
        "followers": 75000000,
        "image": "https://link-to-image/the-weeknd.jpg"
    },
    {
        "name": "Dua Lipa",
        "followers": 60000000,
        "image": "https://link-to-image/dua-lipa.jpg"
    },
    {
        "name": "Drake",
        "followers": 85000000,
        "image": "https://link-to-image/drake.jpg"
    }
])
// Ejemplo de array con 6 álbumes
const albums = ref([
    {
        cover: 'https://picsum.photos/id/101/200/200',
        name: 'Ecos del Tiempo',
        tracks: 12,
        fans: 3400
    },
    {
        cover: 'https://picsum.photos/id/102/200/200',
        name: 'Luz de Invierno',
        tracks: 10,
        fans: 2100
    },
    {
        cover: 'https://picsum.photos/id/103/200/200',
        name: 'Ritmo Urbano',
        tracks: 15,
        fans: 5000
    },
    {
        cover: 'https://picsum.photos/id/104/200/200',
        name: 'Sueños de Verano',
        tracks: 9,
        fans: 1800
    },
    {
        cover: 'https://picsum.photos/id/105/200/200',
        name: 'Noches en Vela',
        tracks: 11,
        fans: 2750
    },
    {
        cover: 'https://picsum.photos/id/106/200/200',
        name: 'Caminos Cruzados',
        tracks: 13,
        fans:
            3200
    }
]);

const tracks = ref([
    {
        image: 'https://link-a-imagen1.jpg',
        title: 'Shape of You',
        artist: 'Ed Sheeran'
    },
    {
        image: 'https://link-a-imagen2.jpg',
        title: 'Blinding Lights',
        artist: 'The Weeknd'
    },
    {
        image: 'https://link-a-imagen3.jpg',
        title: 'Levitating',
        artist: 'Dua Lipa'
    },
    {
        image: 'https://link-a-imagen4.jpg',
        title: 'Dance Monkey',
        artist: 'Tones and I'
    }
]);

</script>