import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import "@/assets/styles/main.scss"
import { EnchanterAptosClient } from '@/libs/enchanter.ts'
import { VueClipboard } from '@soerenmartius/vue3-clipboard'
try {
  window.SDK = new EnchanterAptosClient()
} catch (error) {
  window.SDK = {}
}

createApp(App).use(VueClipboard).use(router).use(store).mount("#app")

