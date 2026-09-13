import { defineConfig } from "vite";
import { svelte, vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/coffee-timer/",
  plugins: [
    svelte({ preprocess: vitePreprocess() }),
    VitePWA({
      registerType: "autoUpdate",
      includeManifestIcons: false,
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
        navigateFallback: "index.html"
      },
      manifest: {
        name: "커피 타이머 · 추출 가이드",
        short_name: "커피 타이머",
        description: "오프라인 커피 레시피 타이머와 추출 로그",
        lang: "ko",
        start_url: "/coffee-timer/",
        scope: "/coffee-timer/",
        display: "standalone",
        orientation: "portrait",
        theme_color: "#f6f1e8",
        background_color: "#f6f1e8",
        icons: [
          {
            src: "icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any maskable"
          }
        ]
      }
    })
  ]
});
