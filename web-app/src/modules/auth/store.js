import api from "@/utils/axios";
import Cookies from "js-cookie";

export default {
  namespaced: true,
  state: () => ({
    user: null,
  }),
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    logout(state) {
      state.user = null;
      Cookies.remove("token");
    },
  },
  actions: {
    async login({ commit }, credentials) {
      const { data } = await api.post("/auth/login", credentials);
      Cookies.set("token", data.token, { secure: true, sameSite: "Strict" });
      commit("setUser", data.user);
    },
    async fetchUser({ commit }) {
      try {
        const { data } = await api.get("/auth/me");
        commit("setUser", data);
      } catch (err) {
        commit("logout");
      }
    },
  },
};
