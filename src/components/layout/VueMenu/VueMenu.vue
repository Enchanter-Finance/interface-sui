<template>
  <div class="menu-layout" v-if="show">
    <slot />    
    <div data-menu-overlay @click="onClose"></div>
  </div>  
</template>

<script>

import { useKeydown } from "@/composables/use-keydown"
export default {
  name: "VueMenu",
  props: {
    show: { type: Boolean, default: false },
  },
  setup(props, { emit }) {
    const { onKeydown } = useKeydown()
    const onClose = () => emit("close")
    onKeydown((event) => {
      if (event.key === "Escape" && props.show === true && props.closeOnEscape === true) {
        onClose()
      }
    })
    
    return {
      onClose,
    }
  }
}
</script>

<style lang="scss">
.menu-layout {  
    min-width: 20.125rem;
    background: #342A4A;
    border: 2px solid #45375A;
    border-radius: 24px;

  box-shadow: rgb(0 0 0 / 1%) 0 0 1px, rgb(0 0 0 / 4%) 0 4px 8px, rgb(0 0 0 / 4%) 0 16px 24px,
    rgb(0 0 0 / 1%) 0 24px 32px;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  position: absolute;
  top: 2rem;
  right: 0;
  z-index: 100;
  user-select: none;

  &__title {
    font-weight: 600;
    font-size: 14px;
  }

  &__label {
    font-size: 14px;
  }

  > div:first-child {
    z-index: 95;
  }
}
[data-menu-overlay] {
  z-index: 1;
  background-color: rgb(255 255 255 / 0%);  
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: -10vh;
  right: 0;
  bottom: 0;
  left: -20vw;
}
</style>
