// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@nuxt/icon',
    '@nuxt/image',

  ],
  vite: {
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: process.env.NODE_ENV === 'production'
        }
      }
    }
  },
  experimental: {
    payloadExtraction: true // Extrae carga útil para páginas estáticas
  },
  image:{
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
      '2xl': 1536
    },
    provider: 'ipx',
    
    // Domains that are allowed to be optimized
    
    // Adjust image quality
    quality: 80,
    
    // Enable format auto-detection (webp, avif, etc.)
    format: ['webp']

  },
  compression: {
    // Opciones del módulo
    algorithm: 'gzip',
    threshold: 1024, // Comprimir archivos mayores a 1KB
    test: /\.(js|css|html|json|svg)$/,
    filename: '[path][base].gz',
    compressionOptions: { level: 9 },
    deleteOriginalAssets: false
  },
  app: {
    head: {
      title: 'ProBusiness - Tienda Online',
      // meta: [
      //   { charset: 'utf-8' },
      //   { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      //   { name: 'description', content: 'Tienda online con productos de alta calidad' }
      // ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'http://localhost:8000', crossorigin: 'anonymous' },

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