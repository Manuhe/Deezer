import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "vuetify/styles";
import vuetify from "./plugins/vuetify";
// main.js o main.ts
import "@mdi/font/css/materialdesignicons.css";
// import "@/assets/styles.css";

createApp(App).use(store).use(router).use(vuetify).mount("#app");
