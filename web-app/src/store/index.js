import { createStore } from "vuex";
import auth from "@/modules/auth/store.js";

export default createStore({
  modules: {
    auth,
  },
});
