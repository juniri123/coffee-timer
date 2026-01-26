import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    svelte(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Coffee Timer",
        short_name: "CoffeeTimer",
        start_url: "/",
        display: "standalone",
        theme_color: "#ffffff",
        background_color: "#ffffff"
      }
    })
  ]
});