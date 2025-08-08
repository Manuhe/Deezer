<template>
    <v-container fluid class="" style="height: 100vh; background-color: #121212;">


        <v-toolbar flat color="#211b27" class="pa-2">

            <v-img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Deezer_logo%2C_2023.svg/1024px-Deezer_logo%2C_2023.svg.png"></v-img>
        </v-toolbar>
        <v-divider color="dark-grey" />
        <div class="d-flex justify-center align-center" style="height: calc(100vh - 600px); color: white;">

            <v-card color="transparent" class="d-flex align-center justify-center flex-column" flat width="500px">
                <v-card-title style="font-size: 80px; color: white;" class="font-weight-bold text-center white--text">
                    Log in
                </v-card-title>
                <v-card-text>
                    <v-sheet class="mx-auto" width="500 " color="transparent">

                        <v-form>
                            <div>countries</div>
                            <v-select :items="countries" item-value="code" item-title="name" v-model="form.country"
                                variant="outlined" color="#3a393d" persistent-placeholder prepend-inner-icon="mdi-email"
                                required></v-select>
                            <div>Phone number</div>
                            <v-text-field v-model="form.phone" variant="outlined" color="#3a393d" persistent-placeholder
                                required></v-text-field>
                            <v-btn class="mt-4 font-weight-bold" color="#b560ff" variant="flat" block height="60"
                                style="font-size: 20px;">Log in</v-btn>
                        </v-form>
                        <div class="text-center mt-4 font-weight-bold"
                            style="color: white; font-size: 18px; padding-top: 50px;">
                            Login in with email address
                        </div>
                        <div class="text-center mt-4 font-weight-bold"
                            style="color: white; font-size: 18px; padding-top: 30px;">
                            or
                        </div>
                        <div class="text-center mt-4 font-weight-bold"
                            style="color: white; font-size: 18px; padding-top: 30px;">
                            <v-btn icon style="margin: 0 5px;">
                                <v-icon size="32" color="#b560ff">mdi-google</v-icon>
                            </v-btn>
                            <v-btn icon style="margin: 0 5px;">
                                <v-icon size="32" color="#b560ff">mdi-facebook</v-icon>
                            </v-btn>
                            <v-btn icon style="margin: 0 5px;">
                                <v-icon size="32" color="#b560ff">mdi-apple</v-icon>
                            </v-btn>
                        </div>
                    </v-sheet>
                </v-card-text>
            </v-card>
        </div>

    </v-container>
</template>

<script setup>
const form = ref({
    country: 'HN',
    phone: '87911345'
})
const countries = ref([
    { name: 'Spain', code: 'ES' },
    { name: 'United States', code: 'US' },
    { name: 'France', code: 'FR' },
    { name: 'Germany', code: 'DE' },
    { name: 'Italy', code: 'IT' },
    { name: 'Honduras', code: 'HN' },
]);
</script>

<style></style>