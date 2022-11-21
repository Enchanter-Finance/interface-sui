<template>
  <div class="swap__header justify--space-between">
    <div class="swap__header__title">Swap</div>
    <div class="swap__header__action">
      <vue-icon-gear @click="settingOpen = true"></vue-icon-gear>        
      <Slippage :settingOpen="settingOpen" @closeSet="settingOpen = false"/>
    </div>
  </div>
</template>

<script setup>
import VueIconGear from "@/components/icons/VueIconGear.vue"
import Slippage from "@/components/common/Slippage.vue"
import { ref, onBeforeUnmount } from "vue"
const settingOpen = ref(false)
</script>

<style lang="scss" scoped>
.swap__header {
  padding: 16px 32px 0 28px;
  width: 100%;
  color: #fff;
  display: flex;
  &__title {
    color: #fff;
    font-weight: 500;
    font-size: 20px;
  }
  &__action {
    height: 20px;
    position: relative;

    > svg {
      width: 20px;
      height: 20px;
      stroke: rgb(195, 197, 203);

      &:hover {
        cursor: pointer;
        opacity: 0.7;
      }
    }
  }
  
}
</style>