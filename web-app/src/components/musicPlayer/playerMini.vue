<template>
    <v-card width="100%" height="100%" class="d-flex align-center pa-2" flat color="transparent">
        <v-card-text>
            <v-row>
                <v-col md="4">
                    <v-list-item>
                        <template v-slot:prepend>
                            <v-img src="https://picsum.photos/id/102/200/200" width="60" height="60" class="mr-3">

                            </v-img>
                        </template>

                        <v-list-item-title class="text-h6">Título de la canción</v-list-item-title>
                        <v-list-item-subtitle>Artista - Álbum</v-list-item-subtitle>
                        <template v-slot:append>
                            <v-btn icon color="#212121" size="small" class="mr-2">
                                <v-icon>mdi-heart-outline</v-icon>
                            </v-btn>
                            <v-btn icon color="#212121" size="small">
                                <v-icon icon="mdi-plus">mdi-plus</v-icon>
                            </v-btn>
                        </template>
                    </v-list-item>
                </v-col>
                <v-col md="4" class="d-flex justify-space-between align-center flex-column">
                    <div class="d-flex justify-center align-center">
                        <v-btn icon color="#212121" active-color="red" size="x-small" class="mr-4">
                            <v-icon size="24">mdi-shuffle</v-icon>
                        </v-btn>
                        <v-btn icon color="#212121" active-color="red" size="x-small" class="mr-2">
                            <v-icon size="32">mdi-skip-previous</v-icon>
                        </v-btn>
                        <v-btn icon color="#212121" size="x-small" class="mx-2">
                            <v-icon size="40">mdi-play-circle-outline</v-icon>
                        </v-btn>
                        <v-btn icon color="#212121" size="x-small" class="ml-2">
                            <v-icon size="32">mdi-skip-next</v-icon>
                        </v-btn>
                        <v-btn icon color="#212121" size="x-small" class="ml-4">
                            <v-icon size="24">mdi-repeat</v-icon>
                        </v-btn>

                    </div>
                    <div class="d-flex justify-center align-center " style="font-size: 12px; color: #888; width: 100%;">
                        <div class="ma-0 pa-0">
                            (00:00)
                        </div>
                        <div class="d-flex justify-center align-center " style="width: 300px; margin: 0 10px;">
                            <v-slider :value="30" max="235" step="1" color="rgb(181, 96, 255)" track-color="#424242"
                                style="width: 300px; margin: 0 10px;" dense></v-slider>
                        </div>
                        <div>
                            3:55
                        </div>
                    </div>
                </v-col>
                <v-col md="4" class="">
                    <div class="d-flex justify-end align-center pt-4">
                        <v-btn icon color="#212121" size="small" class="mr-2">
                            <v-icon size="24">mdi-headphones</v-icon>
                        </v-btn>
                        <v-btn icon color="#212121" size="small" class="mr-2">
                            <v-icon size="24">mdi-microphone-outline</v-icon>
                        </v-btn>
                        <v-btn icon color="#212121" size="small" class="mr-2">
                            <v-icon size="24">mdi-playlist-music-outline</v-icon>
                        </v-btn>
                        <v-btn icon color="#212121" size="small" class="mr-2">
                            <v-icon size="24">mdi-monitor-speaker</v-icon>
                        </v-btn>
                        <v-btn icon color="#212121" size="small" class="mr-2">
                            <v-icon size="24">mdi-volume-high</v-icon>
                        </v-btn>

                        <v-btn icon color="#212121" size="small">
                            <v-icon size="24">mdi-</v-icon>
                        </v-btn>
                    </div>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>


</template>

<script>
export default {

}
</script>

<style></style>