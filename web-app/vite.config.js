import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { Vuetify3Resolver } from "unplugin-vue-components/resolvers"; // <-- Cambia aquí

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [
    vue(),
    AutoImport({
      imports: ["vue", "vuex", "vue-router"],
      dts: "src/auto-imports.d.ts",
    }),
    Components({
      resolvers: [Vuetify3Resolver()], // <-- Cambia aquí
      dts: "src/components.d.ts",
    }),
  ],
});
