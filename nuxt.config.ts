// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@nuxt/icon'

  ],
  app: {
    head: {
      title: 'ProBusiness - Tienda Online',
      // meta: [
      //   { charset: 'utf-8' },
      //   { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      //   { name: 'description', content: 'Tienda online con productos de alta calidad' }
      // ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    },
    //use .env to define environment variables

  },
  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL || 'http://localhost:3000'
    }
  }
})