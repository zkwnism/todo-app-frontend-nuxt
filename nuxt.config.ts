// https://nuxt.com/  // serverMiddleware: [
  //   { path: '/api', handler: '~/server/dist/main.js' }
  // ],docs/api/configuration/nuxt-config
  export default ({
    buildModules: ["@nuxt/typescript-build"],
    css: ['~/assets/css/main.css'],
    postcss: {
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
      },
    },
    router: {
        base: '/pages/index.vue'
      },      
  })