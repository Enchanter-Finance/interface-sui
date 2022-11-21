<template>
  <router-link v-bind="$props" >
    <slot/>
  </router-link>
</template>

<script>
import { RouterLink } from "vue-router"

export default {
  name: "NavLink",
  props: {
    // @ts-ignore
    ...RouterLink.props,
  },
  setup(props) {

    return {  }
  },
}
</script>
