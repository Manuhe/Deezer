import { createRouter, createWebHistory } from "vue-router";

import store from "../store/index.js";
import Cookies from "js-cookie";
import HomeView from "../views/Home.vue";
import LoginView from "../views/Login.vue";
const routes = [
  {
    component: HomeView,
    path: "/",
  },
  {
    component: LoginView,
    path: "/login",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Verifica JWT en cookies antes de cada ruta
router.beforeEach(async (to, from, next) => {
  //   const token = Cookies.get("token");

  //   if (to.meta.requiresAuth) {
  //     if (!token) return next("/login");

  //     if (!store.state.auth.user) {
  //       try {
  //         await store.dispatch("auth/fetchUser");
  //         return next();
  //       } catch {
  //         return next("/login");
  //       }
  //     }

  //     return next();
  //   }

  return next();
});

export default router;
