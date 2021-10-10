
import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)

import { load_modules } from './load_modules'
load_modules(app)
import { createRouter, createWebHashHistory } from "vue-router";
import routes from "virtual:generated-pages";
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

app.use(router)
router.isReady().then(() => {
  app.mount('#app')
})

