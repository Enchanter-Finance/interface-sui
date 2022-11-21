<template>
  <section v-show="title === selectedTitle" role="tabpanel" class="tab__content">
    <slot />
  </section>
</template>

<script>
import {  inject } from "vue"

export default {
  name: "VueTabItem",
  props: {
    title: String,
  },
  setup() {
    const selectedTitle = inject("selectedTitle")

    return { selectedTitle }
  },
}
</script>
