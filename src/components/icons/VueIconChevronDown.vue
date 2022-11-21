<template>
  <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0.97168 1L6.20532 6L11.439 1" :class="themeClass"></path>
  </svg>
</template>

<script>
import { computed } from "vue"
export default {
  name: "VueIconChevronDown",
  props: {
    theme: {
      type: String,
      default: "light",
      validator: (value) => ["light", "dark"].includes(value),
    },
  },
  setup(props) {
    const themeClass = computed(() => (props.theme === "light" ? "icon--light" : "icon--dark"))
    return { themeClass }
  },
}
</script>

<style lang="scss">
.icon {
  &--light {
    stroke: #fff;
  }

  &--dark {
    stroke: #000;
  }
}
</style>
