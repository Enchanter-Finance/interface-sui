<template>
  <div class="remove__header justify--space-between align--center">
    <vue-icon-back @click="handleBack"></vue-icon-back>
    <div class="remove__header__title">Your V2 Liquidity</div>
    <div class="remove__header__action">
      <vue-icon-gear @click="settingOpen = true"></vue-icon-gear> 
      <Slippage :settingOpen="settingOpen" @closeSet="settingOpen = false"/>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import VueIconGear from "@/components/icons/VueIconGear.vue"
import VueIconBack from "@/components/icons/VueIconBack.vue"
import Slippage from "@/components/common/Slippage.vue"
import { useStore } from 'vuex'
import { useRouter } from 'vue-router';

const router = useRouter();
const store = useStore()

const settingOpen = ref(false)

const handleBack = ()=>{
  router.push({ path: '/pool' })
}

</script>

<style lang="scss" scoped>

.remove__header {
  padding: 16px 20px 12px 20px;
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