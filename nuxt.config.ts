// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  build: {
    transpile: ['vuetify'],
  },
  css: ['vuetify/styles', '~/assets/css/main.css'],
  modules: ['nuxt-vuetify'],
  vuetify: {
    moduleOptions: {
      // autoImport: true, // ใช้ถ้าอยาก auto import components
    },
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})
