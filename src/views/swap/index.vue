<template>
   <div class="swap__container">
      <vue-swap></vue-swap>
    </div>
</template>


<script setup>
import VueSwap from "@/components/swap/VueSwap.vue"
import { useStore } from 'vuex'
import { onBeforeUnmount } from "vue"
import { MutationType } from "@/store/mutations"
import { localStorage } from "@/utils/localStorage";
const store = useStore()

const getAllPools = async()=>{
  
  const list = await window.suiSDK.getAllPools()  
  localStorage.set('allPools', list || [])

}
getAllPools()

onBeforeUnmount(() => {
  store.commit(MutationType.SetSelectTokenTopValue, '')
  store.commit(MutationType.SetSelectTokenBottomValue, '')
  if(window.timer){
    clearInterval(window.timer)
    window.timer = null
  }
})

</script>

<style lang="scss">
.swap {
  &__container {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 16px 16px 0;
    -webkit-box-align: center;
    align-items: center;
    flex: 1 1 0;
    z-index: 1;
  }
}
</style>