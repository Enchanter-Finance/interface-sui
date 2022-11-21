<template>
  <header class="navbar">
    <vue-row class="justify--space-between align--center">
      <vue-logo></vue-logo>
      <Navigation :routers="routerItems"></Navigation>
      <NavOptions></NavOptions>
    </vue-row>
  </header>
</template>

<script>
import {  reactive, computed, toRefs } from "vue"
import { useStore } from 'vuex'
import Navigation from "@/components/navigation/VueNavigation/VueNavigation.vue"
import NavOptions from "@/components/navigation/VueOptions/VueOptions.vue"
import VueColumn from "@/components/layout/VueColumn/VueColumn.vue"
import VueRow from "@/components/layout/VueRow/VueRow.vue"
import VueLogo from "@/components/logo/VueLogo/VueLogo.vue"

export default {
  name: "VueHeader ",
  components: { VueRow, VueColumn, NavOptions, Navigation, VueLogo },
  setup() {
    const state = reactive({
      routerItems: [
        {
          path: "/",
          name: "Swap"
        },
        {
          path: "/pool",
          name: "Pool",
          multiples:['Remove','Pool','Add']
        }
      ],
    })

    const store = useStore()

    return { ...toRefs(state) }
  },
}
</script>

<style lang="scss">
.navbar {
  position: relative;
  padding: 32px 24px;
  width: 100%;  
}

.col {
  &--navbar {
    @media #{map-get($display-breakpoints, 'md-only')} {
      margin-left: -92px;
    }
    @media #{map-get($display-breakpoints, 'lg-and-up')} {
      justify-content: center;
      display: flex;
    }
  }
}
</style>
