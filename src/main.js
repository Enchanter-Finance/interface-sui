import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import "@/assets/styles/main.scss"
import { EnchanterAptosClient } from '@/libs/enchanter.ts'
import { EnchanterSuiClient } from '@/libs/enchanter_sui.ts'
import { VueClipboard } from '@soerenmartius/vue3-clipboard'
try {
  window.suiSDK = new EnchanterSuiClient()
} catch (error) {
  window.suiSDK = {}
}

createApp(App).use(VueClipboard).use(router).use(store).mount("#app")

