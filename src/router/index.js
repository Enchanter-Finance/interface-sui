import { createRouter, createWebHashHistory, createWebHistory } from "vue-router"


import Swap from "../views/swap/index.vue"
import Pool from "../views/pool/index.vue"
import Add from "../views/add/index.vue"
import Remove from "../views/remove/index.vue"

const routes = [
  {
    path: "/",
    name: "Swap",
    component: Swap,
  },
  {
    path: "/add/:coinX?/:coinY?",
    name: "Add",
    component: Add,
  },
  {
    path: "/pool",
    name: "Pool",
    component: Pool,
  },
  {
    path: "/remove/:coinX/:coinY",
    name: "Remove",
    component: Remove,
  },
  {
    path: "/find",
    name: "Find",
    component: () => import(/* webpackChunkName: "Find" */ "../views/find/index.vue"),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
