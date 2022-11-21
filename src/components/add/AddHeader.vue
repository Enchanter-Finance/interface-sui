<template>
  <div class="add__header justify--space-between align--center">
    <vue-icon-back @click="handleBack"></vue-icon-back>
    <div class="add__header__title">Add Liquidity</div>
    <div class="add__header__action">
      <vue-icon-gear @click="settingOpen = true"></vue-icon-gear>        
      <Slippage :settingOpen="settingOpen" @closeSet="settingOpen = false"/>
    </div>
  </div>  
  <div class="add__tip">
    Tip: When you add liquidity, you will receive pool tokens representing your position. These tokens automatically earn fees proportional to your share of the pool, and can be redeemed at any time.
  </div>  
</template>

<script setup>
import { ref } from "vue"
import VueIconGear from "@/components/icons/VueIconGear.vue"
import VueIconBack from "@/components/icons/VueIconBack.vue"
import Slippage from "@/components/common/Slippage.vue"
import { useRouter } from 'vue-router';
import { useStore } from 'vuex'

const router = useRouter();
const settingOpen = ref(false)
const store = useStore()


const handleBack = ()=>{
  router.push({ path: '/pool' })
}

</script>

<style lang="scss" scoped>

.add__header {
  padding: 16px 32px 16px;
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
.add__tip{  
  background: rgba(139, 84, 255, 0.2);
  color: #fff;
  border-radius: 12px;
  margin: 0 20px;
  padding: 16px;
}
</style>